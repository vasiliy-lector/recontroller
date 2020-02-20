import { FC, ComponentClass } from 'react';
import { Controller } from './Controller';
import { LocalController } from './LocalController';

export interface GlobalControllerClass<P, S, VP, SS, C extends Controller<P, S, VP, SS> = Controller<P, S, VP, SS>> {
    new(...args: any[]): C;
}

export interface LocalControllerClass<P, S, VP, C extends LocalController<P, S, VP> = LocalController<P, S, VP>> {
    new(...args: any[]): C;
}

export type ControllerClass<P, S, VP, SS = {}> = GlobalControllerClass<P, S, VP, SS> | LocalControllerClass<P, S, VP>;

export type ReactFunctionOrClass<P> = FC<P> | ComponentClass<P, any>;

export type Enhancer<P, VP> = (Component: ReactFunctionOrClass<VP>) => ReactFunctionOrClass<P>;

export type Path = string[];
export interface NextInt {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5 
  [rest: number]: number
}
export type PathType<T, P extends string[], Index extends (keyof P & number) = 0> = {
    [K in (keyof P & number & Index)]: P[K] extends undefined
        ? T
        : P[K] extends keyof T
            ? NextInt[K] extends (keyof P & number)
                ? PathType<T[P[K]], P, Extract<NextInt[K], (keyof P & number)>>
                : T[P[K]]
            : never
}[Index]; 