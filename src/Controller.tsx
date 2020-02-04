import React from 'react';
import { StoreContext, SetState, GetState } from './Store';

interface GlobalControllerClass<P, S, VP, SS, C extends Controller<P, S, VP, SS> = Controller<P, S, VP, SS>> {
    new(...args: any[]): C;
}
interface LocalControllerClass<P, S, VP, C extends LocalController<P, S, VP> = LocalController<P, S, VP>> {
    new(...args: any[]): C;
}

type ControllerClass<P, S, VP, SS = {}> = GlobalControllerClass<P, S, VP, SS> | LocalControllerClass<P, S, VP>;
type ControllerOrView<P, VP = void> = React.StatelessComponent<P> | ControllerClass<P, any, VP>;
export type ControllerProps<P, VP, SS> = P & {
    state: SS,
    getState: GetState<SS>,
    setState: SetState<SS>,
    Component: ControllerOrView<VP>
};
export type LocalControllerProps<P, VP> = P & {
    Component: ControllerOrView<VP>
};
export abstract class Controller<P = {}, S = void, VP = {}, SS = {}>
    extends React.Component<ControllerProps<P, VP, SS>, S> {

    abstract state: S;
    abstract getProps(storeState: SS, props: P, state: S): VP;

	render() {
        const { Component, state, setState, getState, ...props } = this.props;

		return <Component {...this.getProps(state, props as P, this.state) as any}/>;
	}
}

export abstract class LocalController<P = {}, S = void, VP = {}>
    extends React.Component<LocalControllerProps<P, VP>, S> {

    abstract state: S;
    abstract getProps(props: P, state: S): VP;

	render() {
        const { Component, ...props } = this.props;

		return <Component {...this.getProps(props as P, this.state) as any}/>;
	}
}

const isLocalController = <P, S, VP, SS>(Wrapper: ControllerClass<P, S, VP, SS>)
    : Wrapper is LocalControllerClass<P, S, VP> => {

    return Wrapper.prototype instanceof LocalController;
}

export type Enhancer<P, VP> = (Component: ControllerOrView<VP>) => React.StatelessComponent<P>;

export const createEnhancer = <P, S, VP, SS = void>(Wrapper: ControllerClass<P, S, VP, SS>): Enhancer<P, VP> =>
    (Component: ControllerOrView<VP>): React.StatelessComponent<P> =>
        (props: P) => isLocalController(Wrapper)
            ? <Wrapper
                {...props}
                Component={Component}
            />
            : <StoreContext.Consumer>
                {({ state, getState, setState}) => <Wrapper
                    state={state}
                    getState={getState}
                    setState={setState}
                    {...props}
                    Component={Component}
                />}
            </StoreContext.Consumer>;

type EnhancersForCompose<P, VP, A = any, B = any, C = any> =
    [Enhancer<P, VP>] |
    [Enhancer<P, A>, Enhancer<A, VP>] |
    [Enhancer<P, A>, Enhancer<A, B>, Enhancer<B, VP>] |
    [Enhancer<P, A>, Enhancer<A, B>, Enhancer<B, C>, Enhancer<C, VP>];

export const compose = <P, VP>(...enhancers: EnhancersForCompose<P, VP>) => (Component: ControllerOrView<VP>) => {
    let result: any = Component;    

    for (let i = enhancers.length - 1; i > 0; i--) {
        result = enhancers[i](result);
    }

    return result as Enhancer<P, VP>;
};