import React from 'react';
import { SetState, GetState, GetMomentState } from './Store';
import { ReactFunctionOrClass } from './types';

export type ControllerProps<P, VP, SS> = P & {
    state: SS,
    getState: GetState<SS>,
    getMomentState: GetMomentState<SS>,
    setState: SetState<SS>,
    Component: ReactFunctionOrClass<VP>
};

export abstract class Controller<P, S, VP, SS>
    extends React.Component<P, S> {
    isLocal: false = false;
    props!: ControllerProps<P, VP, SS>;

    abstract getProps(storeState: SS, props: P, state: S): VP;

    render() {
        const { Component, state, getState, setState, getMomentState, ...props } = this.props as any;

        return <Component {...this.getProps(state, props, this.state)}/>;
    }
}