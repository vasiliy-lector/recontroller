import React, { FC } from 'react';
import { ControllerClass, Enhancer, ReactFunctionOrClass, LocalControllerClass } from './types'
import { LocalController } from './LocalController';
import { StoreContext } from './Store';

const isLocalController = <P, S, VP, SS>(Wrapper: ControllerClass<P, S, VP, SS>)
    : Wrapper is LocalControllerClass<P, S, VP> => {

    return Wrapper.prototype instanceof LocalController;
}

export const createEnhancer = <P, S, VP, SS = void>(Wrapper: ControllerClass<P, S, VP, SS>): Enhancer<P, VP> =>
    (Component: ReactFunctionOrClass<VP>): FC<P> =>
        (props: P) => isLocalController(Wrapper)
            ? <Wrapper
                {...props}
                Component={Component}
            />
            : <StoreContext.Consumer>
                {({ state, getState, setState}) => <Wrapper
                    {...props}
                    state={state}
                    getState={getState}
                    setState={setState}
                    Component={Component}
                />}
            </StoreContext.Consumer>;
