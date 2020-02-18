import React from 'react';
import { ReactFunctionOrClass } from './types';

export type LocalControllerProps<P, VP> = P & {
    Component: ReactFunctionOrClass<VP>
};

export abstract class LocalController<P, S, VP>
    extends React.Component<P, S> {
    isLocal: true = true;
    props!: LocalControllerProps<P, VP>;

    abstract getProps(props: P, state: S): VP;

    render() {
        const { Component, ...props } = this.props as any;

        return <Component {...this.getProps(props, this.state)}/>;
    }
}