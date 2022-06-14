type Identifier = symbol | string;
type BaseTransitionsMap = { [t in Identifier]: unknown[] };

/**
 * #### Example
 *
 * ```ts
 * import { State } from "./state.ts";
 *
 * type MyState = State<"toggle", { reset: [MyState] }>
 * const On: MyState = Object.freeze({
 *   toggle: () => Off,
 *   reset: (state) => state,
 * });
 * const Off: MyState = Object.freeze({
 *   toggle: () => Off,
 *   reset: (state) => state,
 * });
 * ```
 */
export type State<
  Names extends Identifier = never,
  Map extends BaseTransitionsMap = Record<never, never>,
  Base = void,
> = Readonly<
  (
    & { [t in keyof Map]: FnWithArgs<Names, Map, Base, t> }
    & { [t in Names]: Fn<Names, Map, Base> }
    & Base
  )
>;

type Fn<
  Names extends Identifier,
  Map extends BaseTransitionsMap,
  Base,
> = (...args: []) => State<Names, Map, Base>;

type FnWithArgs<
  Names extends Identifier,
  Map extends BaseTransitionsMap,
  Base,
  Transition extends (keyof Map),
> = (...args: Map[Transition]) => State<Names, Map, Base>;

