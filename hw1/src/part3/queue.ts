import { State, bind } from "./state";
import * as R from "ramda";

export type Queue = number[];

export const enqueue = (x: number): State<Queue, undefined> => {
    return (s: Queue) => [R.append(x, s), undefined];
};

export const dequeue = (s: Queue): [Queue, number] =>{
    const num = s[0];
    const newQ = R.remove(0, 1, s);
    return [newQ, num];
};

export const queueManip: State<Queue, number|undefined> = 
    bind(dequeue, x => bind(enqueue(2*x), y => bind(enqueue(x/3), y => bind(dequeue, z => g => [g, z]))));
