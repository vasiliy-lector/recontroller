import React, { ComponentClass, FC } from 'react';
import { StoreContext, SetState, GetState } from './Store';

interface GlobalControllerClass<P, S, VP, SS, C extends Controller<P, S, VP, SS> = Controller<P, S, VP, SS>> {
    new(...args: any[]): C;
}
interface LocalControllerClass<P, S, VP, C extends LocalController<P, S, VP> = LocalController<P, S, VP>> {
    new(...args: any[]): C;
}
type ControllerClass<P, S, VP, SS = {}> = GlobalControllerClass<P, S, VP, SS> | LocalControllerClass<P, S, VP>;
type ReactFuntionOrClass<P> = FC<P> | ComponentClass<P, any>;
export type ControllerProps<P, VP, SS> = {
    props: P,
    state: SS,
    getState: GetState<SS>,
    setState: SetState<SS>,
    Component: ReactFuntionOrClass<VP>
};
export type LocalControllerProps<P, VP> = {
    props: P,
    Component: ReactFuntionOrClass<VP>
};
export abstract class Controller<P, S, VP, SS>
    extends React.Component<ControllerProps<P, VP, SS>, S> {
    isLocal: false = false;

    abstract state: S;
    abstract getProps(storeState: SS, props: P, state: S): VP;

	render() {
        const { Component, state } = this.props;

		return <Component {...this.getProps(state, this.props.props, this.state)}/>;
	}
}

export abstract class LocalController<P, S, VP>
    extends React.Component<LocalControllerProps<P, VP>, S> {
    isLocal: true = true;

    abstract state: S;
    abstract getProps(props: P, state: S): VP;

	render() {
        const { Component } = this.props;

		return <Component {...this.getProps(this.props.props, this.state)}/>;
	}
}

const isLocalController = <P, S, VP, SS>(Wrapper: ControllerClass<P, S, VP, SS>)
    : Wrapper is LocalControllerClass<P, S, VP> => {

    return Wrapper.prototype instanceof LocalController;
}

export type Enhancer<P, VP> = (Component: ReactFuntionOrClass<VP>) => ReactFuntionOrClass<P>;

export const createEnhancer = <P, S, VP, SS = void>(Wrapper: ControllerClass<P, S, VP, SS>): Enhancer<P, VP> =>
    (Component: ReactFuntionOrClass<VP>): FC<P> =>
        (props: P) => isLocalController(Wrapper)
            ? <Wrapper
                props={props}
                Component={Component}
            />
            : <StoreContext.Consumer>
                {({ state, getState, setState}) => <Wrapper
                    state={state}
                    getState={getState}
                    setState={setState}
                    props={props}
                    Component={Component}
                />}
            </StoreContext.Consumer>;

type EnhancersForCompose<P, VP, A = any, B = any, C = any> =
    [Enhancer<P, VP>] |
    [Enhancer<P, A>, Enhancer<A, VP>] |
    [Enhancer<P, A>, Enhancer<A, B>, Enhancer<B, VP>] |
    [Enhancer<P, A>, Enhancer<A, B>, Enhancer<B, C>, Enhancer<C, VP>];

export const compose = <P, VP>(...enhancers: EnhancersForCompose<P, VP>) => (Component: ReactFuntionOrClass<VP>) => {
    let result: any = Component;    

    for (let i = enhancers.length - 1; i > 0; i--) {
        result = enhancers[i](result);
    }

    return result as Enhancer<P, VP>;
};