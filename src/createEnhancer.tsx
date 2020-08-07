import React from 'react';
import { ControllerClass, Enhancer, LocalControllerClass } from './types'
import { LocalController } from './LocalController';
import { StoreContext } from './Store';

const isLocalController = <P, S, VP, SS>(Wrapper: ControllerClass<P, S, VP, SS>)
    : Wrapper is LocalControllerClass<P, S, VP> => {

    return Wrapper.prototype instanceof LocalController;
}

export const createEnhancer = <P, S, VP, SS = void>(Wrapper: ControllerClass<P, S, VP, SS>): Enhancer<P, VP> =>
    (Component) =>
        function RecontrollerEnhancer(props) {
            const W: any = Wrapper;
            return isLocalController(Wrapper)
                ? <W
                    {...props}
                    Component={Component}
                />
                : <StoreContext.Consumer>
                    {({ state, getState, setState, getMomentState }) => <W
                        {...props}
                        state={state}
                        getState={getState}
                        getMomentState={getMomentState}
                        setState={setState}
                        Component={Component}
                    />}
                </StoreContext.Consumer>;
        }
