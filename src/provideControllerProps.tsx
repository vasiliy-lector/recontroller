import React from 'react';
import { StoreContext, GetState, GetMomentState, SetState } from './Store';
import { Enhancer } from './types';

export const provideControllerProps = <P, SS>(): Enhancer<P, P & {
    state: SS,
    getState: GetState<SS>,
    getMomentState: GetMomentState<SS>,
    setState: SetState<SS>
}> =>
    (Component) =>
        function ControllerPropsProvider(props) {
            const C: any = Component;
            return <StoreContext.Consumer>
                {({ state, getState, setState, getMomentState }) => <C
                    {...props}
                    state={state}
                    getState={getState}
                    getMomentState={getMomentState}
                    setState={setState}
                />}
            </StoreContext.Consumer>;
        }
