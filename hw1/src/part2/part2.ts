import * as R from "ramda";

const stringToArray = R.split("");

/* Question 1 */
export const countVowels : (str: string) => number = R.pipe(
 (x: string) => x.toLowerCase(),
 (x: string) => R.reduce((acc: number, cur: string): number => ['a', 'e', 'i', 'o', 'u'].some((y: string): boolean => y === cur) ? acc + 1: acc, 0, stringToArray(x))
);
  
const encode: (x: string[], count: number, prev: string, index: number) => string = (x, count, prev, index) => {
    if(index >= x.length)
        return count === 1 ? prev : prev + count.toString();
    if(x[index] === prev)
        return encode(x, count + 1, prev, index + 1);
    if(prev !== '')
        return count === 1 ? prev + encode(x, 1, x[index], index + 1) : prev + count.toString() + encode(x, 1, x[index], index + 1);
    return encode(x, 1, x[index], index + 1);
};

/* Question 2 */
export const runLengthEncoding = R.pipe(
    (x: string): string[] => stringToArray(x),
    (x: string[]): string => encode(x, 1, '', 0)
);

const checkPairs: (x: string[], prev: string, index: number, mp: {[key: string] : string}) => boolean = (x, prev, index, mp) => {
    if(index >= x.length)
        return x.length === 0;
    if(['(', '{', '['].includes(x[index]))
        return checkPairs(x, x[index], index+1, mp);
    if(mp[x[index]] === prev)
        return checkPairs(R.remove(index-1, 2, x), '', index-2, mp);
    if(prev !== '')
        return false;
    return checkPairs(x, x[index], index + 1, mp);

};

/* Question 3 */
export const isPaired = R.pipe(
    (x: string): string[] => stringToArray(x),
    (x: string[]): string[] => R.filter(y => ['(', ')', '{', '}', '[', ']'].includes(y), x),
    (x: string[]): boolean => checkPairs(x, '', 0, {')': '(', '}': '{', ']': '['})       
);



