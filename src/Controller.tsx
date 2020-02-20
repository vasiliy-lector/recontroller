import React from 'react';
import { ReactFunctionOrClass, PathType, Path } from './types';

export type ControllerProps<P, VP, SS> = P & {
    state: SS,
    getState: <R extends Path>(path: R) => PathType<SS, R>,
    setState: <R extends Path, V = PathType<SS, R>>(nextState: V, path: R) => void,
    Component: ReactFunctionOrClass<VP>
};

export abstract class Controller<P, S, VP, SS>
    extends React.Component<P, S> {
    isLocal: false = false;
    props!: ControllerProps<P, VP, SS>;

    abstract getProps(storeState: SS, props: P, state: S): VP;

    render() {
        const { Component, state, getState, setState, ...props } = this.props as any;

        return <Component {...this.getProps(state, props, this.state)}/>;
    }
}