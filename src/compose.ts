import { Enhancer, ReactFunctionOrClass } from './types';

// FIXME: any
export function compose(...enhancers: Enhancer<any, any>[]) {
    return (Component: ReactFunctionOrClass<any>) => {
        let result: any = Component;    

        for (let i = enhancers.length - 1; i >= 0; i--) {
            result = enhancers[i](result);
        }

        return result;
    }; 
}