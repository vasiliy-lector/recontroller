import React from 'react';
import { set, view, lensPath } from 'ramda';
import { PathType, Path } from './types';

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
    setState: <P extends Path, V = PathType<S, P>>(nextState: V, path: P) => void,
    getState: <P extends Path>(path: P) => PathType<S, P>
};

export class StoreProvider<S> extends React.Component<Props<S>, State<S>> {
    state: State<S>;
    protected momentState: S;

    constructor(props: Props<S>) {
        super(props);
        this.state = {
            state: props.initialState,
            setState: this.setStoreState,
            getState: this.getStoreState
        } as any;
        this.momentState = props.initialState;
    }

    componentDidUpdate(prevProps: Props<S>, prevState: State<S>) {
        if (prevState.state !== this.state.state) {
            this.props.onStoreChange?.(this.state.state);
        }
    }

    setStoreState = <P extends Path, V = PathType<S, P>>(nextState: V, path: P): void => {
        this.momentState = set(lensPath(path), nextState, this.momentState);
        this.setState({ state: this.momentState });
    }

    getStoreState = <P extends Path>(path: P): PathType<S, P> => view(lensPath(path), this.state.state);

    render() {
        return <StoreContext.Provider value={this.state}>
            {this.props.children}
        </StoreContext.Provider>;
    }
}
