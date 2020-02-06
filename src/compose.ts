import { Enhancer, ReactFunctionOrClass } from './types';

type EnhancersForCompose<P, VP, A = any, B = any> =
    [Enhancer<P, VP>] |
    [Enhancer<P, A>, Enhancer<Partial<A> & Partial<P>, VP>] |
    [Enhancer<P, A>, Enhancer<Partial<A> & Partial<P>, B>, Enhancer<Partial<A> & Partial<B> & Partial<P>, VP>];

export const compose = <P, VP>(...enhancers: EnhancersForCompose<P, VP>) => (Component: ReactFunctionOrClass<VP>) => {
    let result: any = Component;    

    for (let i = enhancers.length - 1; i > 0; i--) {
        result = enhancers[i](result);
    }

    return result as Enhancer<P, VP>;
};