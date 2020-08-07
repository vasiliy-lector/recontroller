import React from 'react';
import { StoreContext, GetState, GetMomentState, SetState } from './Store';
import { ReactFunctionOrClass } from './types';

export type ProvidedControllerProps<P, SS> = P & {
    state: SS,
    getState: GetState<SS>,
    getMomentState: GetMomentState<SS>,
    setState: SetState<SS>
};

export const provideControllerProps =
    <P extends {} = any, SS = any>(Component: ReactFunctionOrClass<ProvidedControllerProps<P, SS>>) =>
        function ControllerPropsProvider(props: P) {
            return <StoreContext.Consumer>
                {({ state, getState, setState, getMomentState }) => <Component
                    {...props}
                    state={state}
                    getState={getState}
                    getMomentState={getMomentState}
                    setState={setState}
                />}
            </StoreContext.Consumer>;
        }
