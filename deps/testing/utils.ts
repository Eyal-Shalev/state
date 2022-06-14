import { unreachable } from "./asserts.ts";
export function deferPromise<T>(): [
  Promise<T>,
  (_: T | PromiseLike<T>) => void,
  (_?: unknown) => void,
] {
  let res: undefined | ((_: T | PromiseLike<T>) => void);
  let rej: undefined | ((_?: unknown) => void);
  const p = new Promise<T>((res2, rej2) => {
    res = res2;
    rej = rej2;
  });
  if (!res) unreachable();
  if (!rej) unreachable();
  return [p, res, rej];
}
