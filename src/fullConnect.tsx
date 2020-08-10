import React from 'react';
import { Enhancer } from './types'
import { StoreContext, GetState, GetMomentState, SetState } from './Store';

export type FullConnectProps<SS> = {
    getState: GetState<SS>,
    getMomentState: GetMomentState<SS>,
    setState: SetState<SS>
};

export const fullConnect =
    <SS, P, VP = any>(getProps: (state: SS, props: P) => VP): Enhancer<P, VP & FullConnectProps<SS>> =>
        (Component) =>
            function RecontrollerFullConnect(props: any) {
                return <StoreContext.Consumer>
                    {({ state, getState, setState, getMomentState }) => <Component
                        {...getProps(state, props)}
                        getState={getState}
                        getMomentState={getMomentState}
                        setState={setState}
                    />}
                </StoreContext.Consumer>;
            }