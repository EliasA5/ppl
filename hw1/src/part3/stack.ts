import { State, bind } from "./state";
import * as R from "ramda";

export type Stack = number[];

export const push = (x: number): State<Stack, undefined> => {
    return (s: Stack) => [R.concat([x], s), undefined];
};

export const pop = (s: Stack): [Stack, number] => {
    const a = s[0];
    const newStack = R.remove(0, 1, s);
    return [newStack, a];
};

export const stackManip: State<Stack, number|undefined> = 
    bind(pop, x => bind(push(x*x), z => bind(pop, y => bind(push(x+y), z => g => [g, z]))));