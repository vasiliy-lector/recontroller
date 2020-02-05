import React, { ComponentClass, FC } from 'react';
import { StoreContext, SetState, GetState } from './Store';

interface GlobalControllerClass<P, S, VP, SS, C extends Controller<P, S, VP, SS> = Controller<P, S, VP, SS>> {
    new(...args: any[]): C;
}
interface LocalControllerClass<P, S, VP, C extends LocalController<P, S, VP> = LocalController<P, S, VP>> {
    new(...args: any[]): C;
}
type ControllerClass<P, S, VP, SS = {}> = GlobalControllerClass<P, S, VP, SS> | LocalControllerClass<P, S, VP>;
type ReactFunctionOrClass<P> = FC<P> | ComponentClass<P, any>;
export type ControllerProps<P, VP, SS> = P & {
    state: SS,
    getState: GetState<SS>,
    setState: SetState<SS>,
    Component: ReactFunctionOrClass<VP>
};
export type LocalControllerProps<P, VP> = P & {
    Component: ReactFunctionOrClass<VP>
};
export abstract class Controller<P, S, VP, SS>
    extends React.Component<P, S> {
    isLocal: false = false;
    props!: ControllerProps<P, VP, SS>;

    abstract state: S;
    abstract getProps(storeState: SS, props: P, state: S): VP;

	render() {
        const { Component, state, getState, setState, ...props } = this.props as any;

		return <Component {...this.getProps(state, props, this.state)}/>;
	}
}

export abstract class LocalController<P, S, VP>
    extends React.Component<P, S> {
    props!: LocalControllerProps<P, VP>;
    isLocal: true = true;

    abstract state: S;
    abstract getProps(props: P, state: S): VP;

	render() {
        const { Component, ...props } = this.props as any;

		return <Component {...this.getProps(props, this.state)}/>;
	}
}

const isLocalController = <P, S, VP, SS>(Wrapper: ControllerClass<P, S, VP, SS>)
    : Wrapper is LocalControllerClass<P, S, VP> => {

    return Wrapper.prototype instanceof LocalController;
}

export type Enhancer<P, VP> = (Component: ReactFunctionOrClass<VP>) => ReactFunctionOrClass<P>;

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

type EnhancersForCompose<P, VP, A = any, B = any, C = any> =
    [Enhancer<P, VP>] |
    [Enhancer<P, A>, Enhancer<A, VP>] |
    [Enhancer<P, A>, Enhancer<A, B>, Enhancer<B, VP>] |
    [Enhancer<P, A>, Enhancer<A, B>, Enhancer<B, C>, Enhancer<C, VP>];

export const compose = <P, VP>(...enhancers: EnhancersForCompose<P, VP>) => (Component: ReactFunctionOrClass<VP>) => {
    let result: any = Component;    

    for (let i = enhancers.length - 1; i > 0; i--) {
        result = enhancers[i](result);
    }

    return result as Enhancer<P, VP>;
};