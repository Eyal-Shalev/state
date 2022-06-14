/**
 * @file Example of a no-buffer channel
 */

import { deferPromise } from "../deps/testing/utils.ts";
import { State } from "../state.ts";

type Base = { promise?: Promise<string> };
type ChannelState = State<
  "get" | "close",
  { send: [string] },
  Base
>;

export const closed: ChannelState = {
  send: () => {
    throw new Error("Invalid transition closed.send(...)");
  },
  get: () => {
    throw new Error("Invalid transition closed.get()");
  },
  close: () => closed,
};

export const idle: ChannelState = {
  send: (val) => sendStuck(val),
  get: () => getStuck(),
  close: () => closed,
};

function sendStuck(val: string): ChannelState {
  const [promise, resolve, reject] = deferPromise<string>();
  return {
    promise,
    send: () => {
      throw new Error("Invalid transition sendStuck.send(...)");
    },
    get: () => {
      resolve(val);
      return idle;
    },
    close: () => {
      reject(new Error("Send on closed"));
      return closed;
    },
  };
}
function getStuck(): ChannelState {
  const [promise, resolve, reject] = deferPromise<string>();
  return {
    promise,
    send: (val: string) => {
      resolve(val);
      return idle;
    },
    get: () => {
      throw new Error("Invalid transition getStuck.get()");
    },
    close: () => {
      reject(new Error("Get on closed"));
      return closed;
    },
  };
}
