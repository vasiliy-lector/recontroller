import React from 'react';
import { Enhancer } from './types'
import { StoreContext } from './Store';

export const provideControllerProps = <P, VP>(): Enhancer<P, VP> =>
    (Component) =>
        function ControllerPropsProvider(props) {
            const C: any = Component;
            return <StoreContext.Consumer>
                {({ state, getState, setState, getMomentState }) => <C
                    {...props}
                    state={state}
                    getState={getState}
                    getMomentState={getMomentState}
                    setState={setState}
                />}
            </StoreContext.Consumer>;
        }
