import { Enhancer } from './types';

export function compose<P, VP>(a: Enhancer<P, VP>): Enhancer<P, VP>;
export function compose<P, VP, A>(a: Enhancer<P, A>, b: Enhancer<A, VP>): Enhancer<P, VP>;
export function compose<P, VP, A, B>(a: Enhancer<P, A>, b: Enhancer<A, B>, c: Enhancer<B, VP>): Enhancer<P, VP>;
export function compose<P, VP>(a: Enhancer<P, any>, ...enhancers: Array<Enhancer<any, any>>): Enhancer<P, VP> {
    return (Component) => {
        let result: any = Component;    

        for (let i = enhancers.length - 1; i >= 0; i--) {
            result = enhancers[i](result);
        }

        return a(result);
    }; 
}