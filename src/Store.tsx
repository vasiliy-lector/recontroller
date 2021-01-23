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
    store: {
        state: S,
        setState: SetState<S>,
        getState: GetState<S>,
        getMomentState: GetMomentState<S>
    }
};

export class StoreProvider<S> extends React.Component<Props<S>, State<S>> {
    state: State<S>;
    protected momentState: S;

    constructor(props: Props<S>) {
        super(props);
        this.state = {
            store: {
                state: props.initialState,
                setState: this.setStoreState,
                getState: this.getStoreState,
                getMomentState: this.getMomentStoreState
            }
        };
        this.momentState = props.initialState;
    }

    componentDidUpdate(prevProps: Props<S>, prevState: State<S>) {
        if (prevState.store.state !== this.state.store.state) {
            this.props.onStoreChange?.(this.state.store.state);
        }
    }

    setStoreState: SetState<S> = (nextState, path) => {
        this.momentState = set(lensPath(path), nextState, this.momentState);
        this.setState({
            store: {
                state: this.momentState,
                setState: this.setStoreState,
                getState: this.getStoreState,
                getMomentState: this.getMomentStoreState
            }
        });
    }

    getStoreState: GetState<S> = (path) => path
        ? view(lensPath(path), this.state.store.state)
        : this.state.store.state;

    getMomentStoreState: GetMomentState<S> = (path) => view(lensPath(path), this.momentState);

    render() {
        return <StoreContext.Provider value={this.state}>
            {this.props.children}
        </StoreContext.Provider>;
    }
}
