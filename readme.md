# Recontroller

Библиотека для управления глобальным state.

## Предназначение

Recontroller выступает, как более простая в использовании замена Redux. Часто в React-приложениях нужно из одного компонента повлиять на данные, нужные другим компонентам. Обычно такие данные хранят на глобальном уровне - в Store. Recontroller тоже следует этой парадигме, но пытается упростить процесс управления Store. Recontroller пытается создать симметрию локального и глобального state (чтобы перейти от локального к глобальному state и наоборот нужно минимум действий с кодом).

## Установка

`npm install recontroller`

# Использование

Recontroller разделяет представление и поведение. В Recontroller используется парадигма enhancer-ов (или hoc-ов - higher order components). В идеале вы никогда не должны использовать React.Component, а вместо этого использовать Controller или LocalController из Recontroller. Задача Controller или LocalController сформировать prop-ы для вашего view. В качестве view используются обычные stateless-компоненты React.

Простейший пример компонента Checkbox.tsx, который берет настройку темы из глобального state и управляет своим состоянием:
```
import React from 'react';
import { Controller, create } from 'recontroller';
import { StoreState } from '../store';

type Props = {
    title: string,
    checked: boolean,
    onClick: (event: any) => void,
    theme: string
};
type PropsController = {
    title: string
};
type StateController = {
    checked: boolean
};

class CheckboxController extends Controller<PropsController, StateController, Props, StoreState> {
    state: StateController = {
        checked: false
    };

    handleClick = () => {
        this.setState({
            checked: !this.state.checked
        })
    }

    getProps({ app: { theme }}: StoreState, { title }: PropsController, { checked }: StateController): Props {
        return {
            title,
            checked,
            theme,
            onClick: this.handleClick
        };
    }
}

const Checkbox: React.FC<Props> = ({ onClick, title, checked, theme }) => {
    return <div
        onClick={onClick}
        className={'checkbox_' + theme}
    >
        <input type='checkbox' checked={checked} /> {title}
    </div>;
};

export default create(CheckboxController)(Checkbox);
```

Если нужен контроллер, которому не нужен доступ к Store, то нужно использовать LocalController. В методе getProps происходит merge всех доступных для view prop-ов: методы контроллера, локальный и глобальный state, prop-ы контроллера.
