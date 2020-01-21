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
export type ControllerProps<P, VP, SS> = {
    props: P,
    state: SS,
    getState: GetState<SS>,
    setState: SetState<SS>,
    Component: ControllerOrView<VP>
};
export type LocalControllerProps<P, VP> = {
    props: P,
    Component: ControllerOrView<VP>
};
export abstract class Controller<P = {}, S = void, VP = {}, SS = {}>
    extends React.Component<ControllerProps<P, VP, SS>, S> {

    abstract state: S;
    abstract getProps(storeState: SS, props: P, state: S): VP;

	render() {
        const { Component, state, props } = this.props;

		return <Component {...this.getProps(state, props, this.state)}/>;
	}
}

export abstract class LocalController<P = {}, S = void, VP = {}>
    extends React.Component<LocalControllerProps<P, VP>, S> {

    abstract state: S;
    abstract getProps(props: P, state: S): VP;

	render() {
        const { Component, props } = this.props;

		return <Component {...this.getProps(props, this.state)}/>;
	}
}

const isLocalController = <P, S, VP, SS>(Wrapper: ControllerClass<P, S, VP, SS>)
    : Wrapper is LocalControllerClass<P, S, VP> => {

    return Wrapper.prototype instanceof LocalController;
}

export const wrap = <P, S, VP, SS>(Wrapper: ControllerClass<P, S, VP, SS>) =>
    (Component: ControllerOrView<VP>): React.StatelessComponent<P> =>
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