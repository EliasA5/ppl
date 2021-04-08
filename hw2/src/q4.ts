import { map } from 'ramda';
import { Exp, Program } from '../imp/L3-ast';
import { Result, makeFailure } from '../shared/result';

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => 
isBoolExp(exp) ? valueToString(exp.val) :
isNumExp(exp) ? valueToString(exp.val) :
isStrExp(exp) ? valueToString(exp.val) :
isLitExp(exp) ? unparseLitExp(exp) :
isVarRef(exp) ? exp.var :
isProcExp(exp) ? unparseProcExp(exp) :
isIfExp(exp) ? `(if ${unparseL31(exp.test)} ${unparseL31(exp.then)} ${unparseL31(exp.alt)})` :
isAppExp(exp) ? `(${unparseL31(exp.rator)} ${unparseLExps(exp.rands)})` :
isPrimOp(exp) ? exp.op :
isLetExp(exp) ? unparseLetExp(exp) :
isDefineExp(exp) ? `(define ${exp.var.var} ${unparseL31(exp.val)})` :
isProgram(exp) ? `(L31 ${unparseLExps(exp.exps)})` :
exp; 

const unparseProg = (list: Exp[]): Result<string> =>{
const a = map(l2ToPython, list);
return a.every(isOk) ? a.map()
}
