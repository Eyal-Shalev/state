import {
  assertEquals,
  assertExists,
  assertNotEquals,
  assertStrictEquals,
  assertThrows,
} from "./deps/testing/asserts.ts";
import { State } from "./state.ts";
import { closed, idle } from "./examples/channel.ts";

Deno.test(function toggle() {
  type Toggle = State<"toggle">;
  const on: Toggle = { toggle: () => off };
  const off: Toggle = { toggle: () => on };

  assertNotEquals(on, off);
  assertStrictEquals(on, off.toggle());
  assertStrictEquals(off, on.toggle());
});

Deno.test(async function examplesChannel() {
  let state = idle;
  assertStrictEquals(state.promise, undefined);

  state = state.send("hello");
  assertThrows(() => state.send("goodbye"));
  assertExists(state.promise);
  let p = state.promise;

  state = state.get();
  assertStrictEquals(state, idle);
  assertEquals(await p, "hello");

  state = state.get();
  assertThrows(() => state.get());
  assertExists(state.promise);
  p = state.promise;

  state = state.send("goodbye");
  assertStrictEquals(state, idle);
  assertEquals(await p, "goodbye");

  state = state.close();
  assertStrictEquals(state, closed);
  assertThrows(() => state.send("hello"));
  assertThrows(() => state.get());
});
