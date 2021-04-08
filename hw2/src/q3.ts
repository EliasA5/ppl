import { /*ClassExp, ProcExp, */ Exp, Program } from "./L31-ast";
import { Result, makeFailure } from "../shared/result";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp =>
    @TODO

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
isEmpty(exp) ? makeFailure("Unexpected empty program") :
isToken(exp) ? makeFailure("Program cannot be a single token") :
isArray(exp) ? parseL1GoodProgram(first(exp), rest(exp)) :
exp;

    export const parseL1Program = (sexp: Sexp): Result<Program> =>
    sexp === "" || isEmpty(sexp) ? makeFailure("Unexpected empty program") :
    isToken(sexp) ? makeFailure("Program cannot be a single token") :
    isArray(sexp) ? parseL1GoodProgram(first(sexp), rest(sexp)) :
    sexp;