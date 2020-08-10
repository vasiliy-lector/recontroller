import React from 'react';
import { Enhancer } from './types'
import { StoreContext, GetState, GetMomentState, SetState } from './Store';

export type FullConnectProps<SS> = {
    getState: GetState<SS>,
    getMomentState: GetMomentState<SS>,
    setState: SetState<SS>
};

// TODO: will be renamed to deprecatedFullConnect
export const fullConnect =
    <P, MP = any, SS = any>(map: (state: SS, props: P) => MP): Enhancer<P, P & MP & FullConnectProps<SS>> =>
        (Component) =>
            function RecontrollerFullConnect(props: any) {
                return <StoreContext.Consumer>
                    {({ state, getState, setState, getMomentState }) => <Component
                        {...props}
                        {...map(state, props)}
                        getState={getState}
                        getMomentState={getMomentState}
                        setState={setState}
                    />}
                </StoreContext.Consumer>;
            }