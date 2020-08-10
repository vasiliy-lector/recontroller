import React from 'react';
import { Enhancer } from './types'
import { StoreContext } from './Store';

export const connect = <P, MP = any, SS = any>(map: (state: SS, props: P) => MP): Enhancer<P, P & MP> =>
    (Component) =>
        function RecontrollerConnect(props: any) {
            return <StoreContext.Consumer>
                {({ state }) => <Component
                    {...props}
                    {...map(state, props)}
                />}
            </StoreContext.Consumer>;
        }
