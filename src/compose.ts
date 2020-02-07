import { Enhancer, ReactFunctionOrClass } from './types';

export function compose<P, VP = any>(a: Enhancer<P, any>, ...enhancers: Array<Enhancer<any, any>>): Enhancer<P, VP> {
    return (Component: ReactFunctionOrClass<VP>) => {
        let result: any = Component;    

        for (let i = enhancers.length - 1; i > 0; i--) {
            result = enhancers[i](result);
        }

        return a(result);
    }; 
}