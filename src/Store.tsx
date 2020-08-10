import React from 'react';
import { set, view, lensPath } from 'ramda'; // TODO: not use ramda

type Path = Array<string | number>;
export type SetState<S> = ((nextState: any, path: Path) => void); // FIXME: any
export type GetState<S> = (() => S) | ((path?: Path) => any); // FIXME: any
export type GetMomentState<S> = (path: Path) => any; // FIXME: any

export const StoreContext = React.createContext<any>({
    state: {},
    setState: () => {},
    getState: () => {}
});

type Props<S> = {
    initialState: S,
    onStoreChange?: (state: S) => any
};
type State<S> = {
    state: S,
    setState: SetState<S>,
    getState: GetState<S>,
    getMomentState: GetMomentState<S>
};

export class StoreProvider<S> extends React.Component<Props<S>, State<S>> {
    state: State<S>;
    protected momentState: S;

    constructor(props: Props<S>) {
        super(props);
        this.state = {
            state: props.initialState,
            setState: this.setStoreState,
            getState: this.getStoreState,
            getMomentState: this.getMomentStoreState
        };
        this.momentState = props.initialState;
    }

    componentDidUpdate(prevProps: Props<S>, prevState: State<S>) {
        if (prevState.state !== this.state.state) {
            this.props.onStoreChange?.(this.state.state);
        }
    }

    setStoreState: SetState<S> = (nextState, path) => {
        this.momentState = set(lensPath(path), nextState, this.momentState);
        this.setState({ state: this.momentState });
    }

    getStoreState: GetState<S> = (path) => path
        ? view(lensPath(path), this.state.state)
        : this.state.state;

    getMomentStoreState: GetMomentState<S> = (path) => view(lensPath(path), this.momentState);

    render() {
        return <StoreContext.Provider value={this.state}>
            {this.props.children}
        </StoreContext.Provider>;
    }
}
