import WS from "jest-websocket-mock";
import {
  UsePlayserveProps,
  UsePlayserveReturn,
  usePlayserve
} from "./use-playserve";
import { MessageType, getMessage } from "@/types/playserve/message";
import React, { useState } from "react";
import { act } from "@testing-library/react";
import { renderWithProviders } from "@/utils/test-utils";
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "@/redux/modules";
import { DEFAULT_STATE_MOCK } from "@/mocks/default-state";

const sleep = (duration = 0) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const getUrl = (port: number) => `ws://localhost:${port}`;

const getMockStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer
    },
    preloadedState: {
      ...DEFAULT_STATE_MOCK
    }
  });
};

function setupServer(url: string) {
  return new WS(url);
}

function setup(props?: UsePlayserveProps, useUndefinedProps = false) {
  const returnVal = {} as UsePlayserveReturn & {
    setUrl: (url: string) => void;
  };
  function TestComponent() {
    const [url, setUrl] = useState(props?.url); // eslint-disable-line
    Object.assign(
      returnVal,
      usePlayserve(useUndefinedProps ? undefined : { ...(props || {}), url })
    );
    returnVal.setUrl = setUrl;
    return null;
  }
  renderWithProviders(<TestComponent />, undefined, getMockStore());
  return returnVal;
}

afterEach(() => {
  WS.clean();
});

it("usePlayserve - can establish websocket connection", async () => {
  const url = getUrl(10001);
  const server = setupServer(url);
  const props = setup({ url });

  await server.connected;

  expect(props.websocket).toBeDefined();
  expect(props.websocket.readyState).toBe(WebSocket.OPEN);

  server.close();
});

it("usePlayserve - can reconnect if disconnected", async () => {
  const url = getUrl(10002);
  let server = setupServer(url);
  setup({ url });

  await server.connected;

  expect(server.server.clients().length).toBe(1);

  await act(async () => {
    server.close();
    await sleep(10);
  });

  expect(server.server.clients().length).toBe(0);

  await act(async () => {
    server = setupServer(url);
    await sleep(200);
  });

  await act(() => null);

  await server.connected;

  expect(server.server.clients().length).toBe(1);

  server.close();
}, 100000);

it("usePlayserve - can send messages", async () => {
  const url = getUrl(10003);
  const message = getMessage(MessageType.GetOrySession);

  const props = setup({ url });

  await sleep(10);

  props.sendMessage(message)();

  const server: WS = setupServer(url);
  await act(async () => {
    await sleep(200);
  });
  await server.connected;

  await sleep(10);

  let serverMessage = await server.nextMessage;

  const responsePromise = props.sendMessage(message)();

  serverMessage = await server.nextMessage;

  expect(serverMessage).toBe(JSON.stringify(message));

  server.send(
    JSON.stringify({
      id: message.id,
      message_type: MessageType.GetOrySession,
      status: 200
    })
  );

  const response = await responsePromise;

  expect(response.message_type).toBe(MessageType.GetOrySession);
  expect(response.status).toBe(200);

  server.close();
}, 1000000);

it("usePlayserve - test prop onReady", async () => {
  const url = getUrl(10004);
  const server = setupServer(url);
  const onReady = jest.fn();
  setup({ onReady, url });

  await server.connected;

  await sleep(10);

  expect(onReady).toBeCalled();

  server.close();
});

it("usePlayserve - test prop onMessage", async () => {
  const url = getUrl(10005);
  const server = setupServer(url);
  const onMessage = jest.fn();
  setup({ onMessage, url });
  const response = {
    message_type: MessageType.GetOrySession,
    status: 200,
    body: "{}"
  };

  await server.connected;
  server.send(JSON.stringify(response));

  await sleep(10);

  expect(onMessage).toHaveBeenCalledWith({
    message_type: MessageType.GetOrySession,
    status: 200,
    body: "{}"
  });

  server.close();
});

it("usePlayserve - handles invalid server message", async () => {
  const url = getUrl(10006);
  const server = setupServer(url);
  const onMessage = jest.fn();
  setup({ onMessage, url });

  await server.connected;

  server.send("invalid");
  await sleep(10);
  expect(onMessage).toHaveBeenCalledTimes(0);

  server.send({
    message_type: MessageType.GetOrySession,
    status: 200,
    body: "invalid body"
  });
  await sleep(10);
  expect(onMessage).toHaveBeenCalledTimes(0);

  server.close();
});

it("usePlayserve - can change urls on hook", async () => {
  const url = getUrl(10007);
  const url2 = getUrl(10008);
  const server = setupServer(url);
  const server2 = setupServer(url2);

  const props = setup({ url });
  await server.connected;
  expect(props.websocket).toBeDefined();
  expect(props.websocket.readyState).toBe(WebSocket.OPEN);

  act(() => props.setUrl(url2));
  await server2.connected;
  expect(props.websocket).toBeDefined();
  expect(props.websocket.readyState).toBe(WebSocket.OPEN);

  server.close();
  server2.close();
});
