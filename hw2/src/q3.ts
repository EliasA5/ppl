import { isAtomicExp, isDefineExp, isCExp, ClassExp, Binding, CExp, ProcExp,  Exp, Program, isExp, isProgram, makeProgram, makePrimOp, makeProcExp, makeIfExp, makeVarDecl, makeAppExp, makeVarRef, makeStrExp, makeBoolExp, isClassExp, makeLitExp, makeDefineExp, isLitExp, isIfExp, isAppExp, isProcExp, isLetExp, makeLetExp, makeBinding, VarDecl } from "./L31-ast";
import { Result, makeFailure, makeOk } from "../shared/result";
import { map, zipWith } from 'ramda';
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
isExp(exp) ? makeOk(rewriteAllClass2ProcExp(exp)) : 
isProgram(exp) ? makeOk(makeProgram(map(rewriteAllClass2ProcExp, exp.exps))) :
exp;

const rewriteAllClass2ProcExp = (exp: Exp): Exp =>
isCExp(exp) ? rewriteAllClass2ProcCExp(exp) :
isDefineExp(exp) ? makeDefineExp(exp.var, rewriteAllClass2ProcCExp(exp.val)):
exp;

const rewriteAllClass2ProcCExp = (exp: CExp): CExp => 
isAtomicExp(exp) ? exp :
isLitExp(exp) ? exp :
isIfExp(exp) ? makeIfExp(rewriteAllClass2ProcCExp(exp.test), rewriteAllClass2ProcCExp(exp.then), rewriteAllClass2ProcCExp(exp.alt)) :
isAppExp(exp) ? makeAppExp(rewriteAllClass2ProcCExp(exp.rator), map(rewriteAllClass2ProcCExp, exp.rands)) :
isProcExp(exp) ? makeProcExp(exp.args, map(rewriteAllClass2ProcCExp, exp.body)) :
isLetExp(exp) ? makeLetExp( zipWith(makeBinding, map((x: Binding): string => x.var.var, exp.bindings), map((x: Binding): CExp => rewriteAllClass2ProcCExp(x.val), exp.bindings)),
                        map(rewriteAllClass2ProcCExp, exp.body)) :
isClassExp(exp) ? rewriteAllClass2ProcCExp(class2proc(exp)) :
exp;


//(map((x:Binding): VarDecl => x.var),map((x:Binding): CExp => rewriteAllClass2ProcCExp(x.val)))
