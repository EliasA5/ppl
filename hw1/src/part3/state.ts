export type State<S, A> = (initialState: S) => [S, A];

export const bind = <S ,A, B>(state: State<S,A>, f: (x:A) => State<S,B>): State<S,B> => {
    return (s: S) => {
        const compState = state(s);
        return f(compState[1])(compState[0])
    };
};

