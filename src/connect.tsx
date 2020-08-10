import React from 'react';
import { Enhancer } from './types'
import { StoreContext } from './Store';

export const connect = <SS, P, VP = any>(getProps: (state: SS, props: P) => VP): Enhancer<P, VP> =>
    (Component) =>
        function RecontrollerConnect(props: any) {
            return <StoreContext.Consumer>
                {({ state }) => <Component
                    {...getProps(state, props)}
                />}
            </StoreContext.Consumer>;
        }
