import { Exp, VarDecl, isBoolExp, isProgram, isDefineExp, isPrimOp, isAppExp, isIfExp, isNumExp, isStrExp, isVarRef, isProcExp, Program, ProcExp, AppExp, CExp, IfExp } from '../imp/L3-ast';
import { Result, makeFailure, makeOk, mapResult, bind, isOk } from '../shared/result';
import { isNumber } from '../shared/type-predicates';
import { map } from 'ramda';
import { stringify } from 'node:querystring';



/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => 
isBoolExp(exp) ? makeOk(valueToString(exp.val)) :
isNumExp(exp) ? makeOk(valueToString(exp.val)) :
isStrExp(exp) ? makeOk(valueToString(exp.val)) :
isVarRef(exp) ? makeOk(exp.var) :
isProcExp(exp) ? unparseProcExpToPython(exp) :
isIfExp(exp) ? bind(mapResult(l2ToPython, [exp.then, exp.test, exp.alt]), (s: string[]): Result<string> => makeOk(`(${s[0]} if ${s[1]} else ${s[2]})`)):
isAppExp(exp) ? unparseAppToPython(exp) :
isPrimOp(exp) ? makeOk(exp.op) :
isDefineExp(exp) ? bind(l2ToPython(exp.val), (s:string): Result<string> => makeOk(`${exp.var.var} = ${s}`)) :
isProgram(exp) ? unparseLExpsToPython(exp.exps) :
makeFailure('expression is not valid');

const unparseLExpsToPython = (exps: Exp[]): Result<string> =>
    bind(mapResult(l2ToPython, exps), (s: string[]): Result<string> => makeOk(s.join("\n")));

type Value = number | boolean | string;

const isValue = (x: any): x is Value => typeof(x) === 'number' || typeof(x) === 'boolean' || typeof(x) === 'string';

const valueToString = (str: Value): string =>
    str === true ? 'true':
    str === false ? 'false':
    isNumber(str) ? str.toString():
    str;

const unparseProcExpToPython = (exp: ProcExp): Result<string> =>
    bind(unparseLExpsToPython(exp.body), (s:string): Result<string> => makeOk(`(lambda ${map((p: VarDecl) => p.var, exp.args).join(",")} : ${s})`));

const unparseAppToPython = (exp: AppExp): Result<string> =>
    {
        const op = operatorToString(exp.rator);
        const first = exp.rands.length !== 0 ? l2ToPython(exp.rands[0]) : makeFailure('no operands');
        
        return  op === 'not'&& exp.rands.length === 1 && isOk(first) ? makeOk(`(not ${first.value})`): 
                op === 'boolean?' && exp.rands.length === 1 && isOk(first) ? makeOk(`(lambda x : (type(x) == bool) ${first.value}`):
                op === 'number?' && exp.rands.length === 1 && isOk(first) ? makeOk(`(lambda x : (type(x) == int) ${first.value}`) :
                op === 'eq?' && exp.rands.length === 2 ? bind(mapResult(l2ToPython, exp.rands), (s: string[]): Result<string> => makeOk(`(${s.join(` == `)})`)) :
                op === '<' && exp.rands.length === 2 ? bind(mapResult(l2ToPython, exp.rands), (s: string[]): Result<string> => makeOk(`(${s.join(` < `)})`)):
                op === '>' && exp.rands.length === 2 ? bind(mapResult(l2ToPython, exp.rands), (s: string[]): Result<string> => makeOk(`(${s.join(` > `)})`)):
                op === '=' && exp.rands.length === 2 ? bind(mapResult(l2ToPython, exp.rands), (s: string[]): Result<string> => makeOk(`(${s.join(` == `)})`)) :
                ['-', '+', '/', '*', 'and', 'or'].includes(op) ? bind(mapResult(l2ToPython, exp.rands), (s: string[]): Result<string> => makeOk(`(${s.join(` ${op} `)})`)) :
                isVarRef(exp.rator) ? bind(mapResult(l2ToPython, exp.rands), (s: string[]): Result<string> => makeOk(`${op}(${s.join(",")})`)) :
                isValue(exp.rator) ? makeOk(op):
                isProcExp(exp.rator) ? bind(l2ToPython(exp.rator), s_1 => bind(mapResult(l2ToPython, exp.rands), s_2 => makeOk(`${s_1}(${s_2})`))):
                makeFailure('bad operand');
    };

const operatorToString = (op: CExp): string =>
    isPrimOp(op) ? op.op:
    isVarRef(op) ? op.var:
    isValue(op) ? valueToString(op):
    'failure';