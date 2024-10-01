use std::net::IpAddr;
use std::{sync::Arc, time::Duration};

use async_trait::async_trait;
use lazy_static::lazy_static;
use parking_lot::Mutex;
use russh::keys::key::PublicKey;
use russh::{client, ChannelMsg};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio_util::sync::CancellationToken;

lazy_static! {
    static ref BRIDGE_CANCELLATION: Arc<Mutex<Option<CancellationToken>>> =
        Arc::new(Mutex::new(None));
}

struct Client {}

#[async_trait]
impl client::Handler for Client {
    type Error = russh::Error;

    async fn check_server_key(&mut self, _key: &PublicKey) -> Result<bool, Self::Error> {
        Ok(true)
    }
}

struct Session {
    session: client::Handle<Client>,
    port: u32,
}

impl Session {
    async fn connect(
        address: IpAddr,
        local_port: u16,
        username: String,
        password: String,
    ) -> Result<Self, russh::Error> {
        let config = client::Config {
            inactivity_timeout: Some(Duration::from_secs(5)),
            ..<_>::default()
        };
        let config = Arc::new(config);
        let sh = Client {};
        let session = tokio::time::timeout(
            Duration::from_secs(15),
            client::connect(config, (address, 22), sh),
        )
        .await
        .map_err(|_err| russh::Error::ConnectionTimeout)?;
        let mut session = session?;
        session.authenticate_password(username, password).await?;
        Ok(Session {
            session,
            port: local_port.into(),
        })
    }

    async fn playserve_socket(&mut self) -> Result<russh::Channel<client::Msg>, russh::Error> {
        self.session
            .channel_open_direct_tcpip("localhost", 8080, "localhost", self.port)
            .await
    }

    async fn close(&mut self) -> Result<(), russh::Error> {
        self.session
            .disconnect(russh::Disconnect::ByApplication, "", "English")
            .await
    }
}

#[tauri::command]
pub async fn initialize_device_connection(
    address: String,
    username: Option<String>,
    password: Option<String>,
) -> Result<String, String> {
    log::info!("Handling connection to {address}");
    let address: IpAddr = address
        .parse()
        .map_err(|_err| "Ip address is invalid".to_string())?;
    if address.is_loopback() {
        println!("Address is loopback, connect to playserve directly");
        // Any localhost connections should be done directly to playserve
        return Ok("127.0.0.1:8080".to_string());
    }
    log::info!("Creating new ssh bridge");
    // Randomize the socket
    let local_socket = TcpListener::bind("127.0.0.1:0")
        .await
        .map_err(|err| format!("Unable to bind local socket {err:?}"))?;
    let local_address = local_socket
        .local_addr()
        .map_err(|err| format!("Unable to get local address {err:?}"))?;
    log::debug!("Listening on {local_address:?}");

    let username = username.unwrap_or(String::from("playtron"));
    let password = password.unwrap_or(String::from("playtron"));

    let mut session = Session::connect(address, local_address.port(), username, password)
        .await
        .map_err(|err| format!("Unable to initialize connection {err:?}"))?;
    let channel = session
        .playserve_socket()
        .await
        .map_err(|err| format!("Unable to bind playserve socket {err:?}"))?;

    let cancellation = CancellationToken::new();
    tokio::spawn(message_loop(
        session,
        channel,
        local_socket,
        cancellation.clone(),
    ));

    // Close previous bridge, and set a new one
    let mut bridge_cancel = BRIDGE_CANCELLATION.lock();
    let existing_cancellation = bridge_cancel.take();
    if let Some(cancel) = existing_cancellation {
        cancel.cancel()
    }
    *bridge_cancel = Some(cancellation);

    Ok(local_address.to_string())
}

async fn message_loop(
    mut session: Session,
    mut channel: russh::Channel<client::Msg>,
    local_socket: TcpListener,
    cancellation: CancellationToken,
) {
    // We currently respect only one websocket connection per bridge
    let (mut socket, _) = local_socket.accept().await.expect("Failed to accept");
    let mut buffer = [0; 8 * 1024];
    loop {
        tokio::select! {
            msg = channel.wait() => {
                match msg {
                    Some(ChannelMsg::ExtendedData { data, .. }) => {
                        if let Err(err) = socket.write_all(&data).await {
                            log::error!("Failed to forward extended message to frontend {err:?}");
                            break;
                        }
                    },
                    Some(ChannelMsg::Data { data }) => {
                        if let Err(err) = socket.write_all(&data).await {
                            log::error!("Failed to forward message to frontend {err:?}");
                            break;
                        }
                    },
                    Some(ChannelMsg::Eof) => {
                        break
                    }
                    Some(msg) => {
                        println!("Socket msg {msg:?}");
                    }
                    None => {
                        break;
                    }
                }
            }

            len = socket.read(&mut buffer) => {
                if let Ok(len) = len {
                    if len > 0 {
                        if let Err(err) = channel.data(&buffer[0..len]).await {
                            log::error!("Error sending data through SSH {err:?}");
                        }
                    }
                }
            }

            _ = cancellation.cancelled() => {
                break
            }
        }
    }
    log::info!("Closing socket for {:?}", local_socket.local_addr());
    let _ = channel.close().await;
    let _ = session.close().await;
}
