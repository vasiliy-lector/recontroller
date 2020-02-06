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

export type Enhancer<P, VP extends Partial<P>> = (Component: ReactFunctionOrClass<VP>) => ReactFunctionOrClass<P>;