import { getWebsocketUrl } from "@/constants";
import { selectAuthDeviceIp } from "@/redux/modules";
import { useAppSelector } from "@/redux/store";
import { Message, MessageType } from "@/types/playserve/message";
import { PlayserveResponse } from "@/types/playserve/response";
import { info, error, warn } from "@tauri-apps/plugin-log";
import { useCallback, useEffect, useMemo, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}

type ResponseHandler<T extends MessageType> = (
  message: PlayserveResponse<T>
) => void;

const MAX_RETRIES = 3;
const RETRY_DELAY = 300; // ms

const MESSAGE_TIMEOUT_WHEN_NOT_CONNECTED = 3000;

const wsMap: Record<string, WS> = {};

class WS {
  url: string;
  retries: number;
  isReady = false;

  // Cache websocket so it can be used globally across hooks
  // @ts-expect-error Value is initialized in constructor
  _websocket: WebSocket;
  _websocketInterval: ReturnType<typeof setInterval> | null = null;

  // Called when the connection to the WebSocket server is lost
  onConnectionLost?: () => void;

  // Called when the websocket is ready
  onReadyHandlers: Record<string, (websocket: WebSocket) => void> = {};

  // Map of all hooks with handlers used to handle messages
  messageHandlers: Record<
    number,
    (response: PlayserveResponse<MessageType>) => void
  > = {};

  // Handlers for messages that are only called once
  onceMessageHandlers: Record<
    MessageType,
    Record<number, ResponseHandler<any>[]>
  > = {} as any;

  // Buffer of messages to send when the websocket is ready
  messagesBuffer: string[] = [];

  constructor(url: string) {
    if (!url) {
      throw new Error("Websocket URL is required");
    }
    wsMap[url] = this;
    this.url = url;

    this._websocketInterval = setInterval(() => {
      if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
        this.messagesBuffer.forEach((message) => this._websocket.send(message));
        this.messagesBuffer = [];

        if (!this.isReady) {
          this.isReady = true;
          Object.values(this.onReadyHandlers).forEach(
            (handler) => handler && handler(this._websocket)
          );
        }
      } else {
        this.isReady = false;
      }
    }, 1);
    this.retries = 0;
    this.initializeWebsocket();
  }

  initializeWebsocket() {
    if (this._websocket) {
      this._websocket.close();
    }

    this._websocket = new WebSocket(this.url);

    const reconnect = () => {
      if (this.retries == MAX_RETRIES) {
        delete wsMap[this.url];
        if (this.onConnectionLost) {
          this.onConnectionLost();
        }
        return;
      }
      this.retries++;
      setTimeout(() => this.initializeWebsocket(), RETRY_DELAY);
    };

    this._websocket.onopen = () => {
      console.log("Connected to websocket");
      info("Connected to websocket");
      this.retries = 0;
    };

    this._websocket.onclose = () => {
      console.log("Disconnected from websocket");
      warn("Disconnected from websocket");
      this.isReady = false;
      reconnect();
    };

    this._websocket.onerror = (err) => {
      console.error("Websocket error: ", err);
      error("Websocket error occured");
    };

    this._websocket.onmessage = (message) => {
      try {
        if (!isJsonString(message.data)) {
          return;
        }
        const data: PlayserveResponse<MessageType> = JSON.parse(message.data);
        info(
          `Websocket message: ${data.message_type} ${message.data.substring(0, 500)}`
        );
        console.log("Websocket message", data);

        Object.values(this.messageHandlers).forEach(
          (handler) => handler && handler(data)
        );

        const onceHandlers =
          this.onceMessageHandlers[data.message_type as MessageType]?.[data.id];

        if (onceHandlers) {
          onceHandlers.forEach((handler) => handler && handler(data));
          this.onceMessageHandlers[data.message_type as MessageType][data.id] =
            [];
        }
      } catch (err) {
        console.error(err);
      }
    };
  }

  sendMessage<MessageT extends MessageType>(
    message: Message<MessageT>
  ): () => Promise<PlayserveResponse<MessageT>> {
    console.log("Sending message: ", message);
    info(`Sending message ${message.message_type}`);

    const stringMessage = JSON.stringify(message);

    if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
      this._websocket.send(stringMessage);
    } else {
      warn("Websocket not ready, buffering message");
      this.messagesBuffer.push(stringMessage);

      setTimeout(() => {
        const index = this.messagesBuffer.indexOf(stringMessage);

        if (!this.isReady && index !== -1) {
          this.messagesBuffer.splice(index, 1);

          const onceMessageHandlers =
            this.onceMessageHandlers[message.message_type]?.[message.id] || [];
          for (let i = 0; i < onceMessageHandlers.length; i++) {
            onceMessageHandlers[i]({ status: 500 });
          }
        }
      }, MESSAGE_TIMEOUT_WHEN_NOT_CONNECTED);
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    return function () {
      return new Promise<PlayserveResponse<MessageT>>((resolve) => {
        if (!_this.onceMessageHandlers[message.message_type]) {
          _this.onceMessageHandlers[message.message_type] = {};
        }

        if (!_this.onceMessageHandlers[message.message_type][message.id]) {
          _this.onceMessageHandlers[message.message_type][message.id] = [];
        }

        _this.onceMessageHandlers[message.message_type][message.id].push(
          (response) => {
            resolve(response);
          }
        );
      });
    };
  }
}
export type UsePlayservProps = {
  onMessage?: (message: PlayserveResponse<MessageType>) => void;
  onReady?: () => void;
  url?: string;
};

export type UsePlayservSendMessageProps = {
  url?: string;
};

export type SendMessage = <MessageT extends MessageType>(
  message: Message<MessageT>
) => () => Promise<PlayserveResponse<MessageT>>;

export type UsePlayservReturn = {
  sendMessage: SendMessage;
  websocket: WebSocket;
};

// Keep track of all hooks by id
let hookId = 1;

export const usePlayserve = ({
  onMessage,
  onReady,
  url: wsUrl
}: UsePlayservProps = {}): UsePlayservReturn => {
  const deviceIp = useAppSelector(selectAuthDeviceIp);

  const url = useMemo(() => {
    if (!wsUrl) {
      return getWebsocketUrl(deviceIp);
    }
    return wsUrl;
  }, [wsUrl, deviceIp]);

  const [id] = useState(() => hookId++);
  const ws = useMemo(() => {
    return wsMap[url] || new WS(url);
  }, [url]);

  // Function to send a message to the websocket
  // Returns a function that if called, will expect a response from the websocket and return the result once received
  const sendMessage = useCallback(ws.sendMessage.bind(ws), [ws]);

  // Add handler for connection lost
  useEffect(() => {
    if (ws) {
      ws.onConnectionLost = () => {
        console.log("Websocket connection lost!");

        const redirectTo = "/auth/connect";
        // Check that we are not already on the connect page
        // so we don't get stuck in a redirect loop
        if (
          window.location.pathname != redirectTo &&
          window.location.pathname !== "/auth"
        ) {
          window.location.href = redirectTo;
        }
      };
    }
    // Remove hook on no longer used web socket
    return () => (ws.onConnectionLost = undefined);
  }, [ws]);

  // Add a message handler for this hook
  useEffect(() => {
    if (ws && onMessage) {
      ws.messageHandlers[id] = onMessage;
    }

    return () => {
      if (ws) {
        delete ws.messageHandlers[id];
      }
    };
  }, [ws, onMessage, id]);

  // Add a on ready handler for this hook
  useEffect(() => {
    if (ws && onReady) {
      ws.onReadyHandlers[id] = onReady;
    }

    return () => {
      if (ws) {
        delete ws.onReadyHandlers[id];
      }
    };
  }, [ws, onReady, id]);

  return {
    sendMessage,
    websocket: ws._websocket
  };
};

export const usePlayserveSendMessage = (): SendMessage => {
  const deviceIp = useAppSelector(selectAuthDeviceIp);
  const url = useMemo(() => {
    return getWebsocketUrl(deviceIp);
  }, [deviceIp]);
  const ws = useMemo(() => {
    return wsMap[url] || new WS(url);
  }, [url]);

  // Function to send a message to the websocket
  // Returns a function that if called, will expect a response from the websocket and return the result once received
  const sendMessage = useCallback(ws.sendMessage.bind(ws), [ws]);

  return sendMessage;
};

export function sendPlayserveMessage<MessageT extends MessageType>(
  deviceIp: string,
  message: Message<MessageT>
): () => Promise<PlayserveResponse<MessageT>> {
  const url = getWebsocketUrl(deviceIp);
  const ws = wsMap[url] || new WS(url);

  return ws.sendMessage<MessageT>(message);
}
