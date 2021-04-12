import { ClassExp, Binding, CExp, ProcExp,  Exp, Program, isExp, isProgram, makeProgram, makePrimOp, makeProcExp, makeIfExp, makeVarDecl, makeAppExp, makeVarRef, makeStrExp, makeBoolExp, isClassExp, makeLitExp } from "./L31-ast";
import { Result, makeFailure, makeOk } from "../shared/result";
import { map } from 'ramda';
import { first, rest } from "../shared/list";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp =>{
    const vars = exp.fields;
    const methods = exp.methods;
    const methods2ifs = (bindings: Binding[]): CExp =>
        bindings.length !== 0 ? makeIfExp(makeAppExp(makePrimOp('eq?'), [makeVarRef('msg'), makeLitExp(`'${first(bindings).var.var}`)]), makeAppExp(first(bindings).val,[]), methods2ifs(rest(bindings))) :
                                makeBoolExp(false);

    return makeProcExp(vars, [makeProcExp([makeVarDecl('msg')], [methods2ifs(methods)])]);
}



/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/

export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
isClassExp(exp) ? makeOk(class2proc(exp)) : makeFailure('@todo');
/*
isExp(exp) ? makeOk(rewriteAllClassExp(exp)) :
isProgram(exp) ? makeOk(makeProgram(map(rewriteAllClassExp, exp.exps))) :
exp;

const rewriteAllClassExp = (exp: Exp): Result<Exp> =>
    makeFailure('@todo')
    */