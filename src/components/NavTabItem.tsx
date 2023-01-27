import React from 'react';
import classNames from "classnames";
import {NavLink} from "react-router-dom";

export interface NavTabItemProps {
    id: string;
    to: string;
    title: string;
    className?: string | classNames.ArgumentArray,
    icon?: string;
    canClose?: boolean;
    disabled?: boolean;
    onClose?: (id?: string) => void;
}

const NavTabItem = ({id, to, title, icon, className, canClose, disabled, onClose}: NavTabItemProps) => {
    const closeHandler = () => {
        if (onClose) {
            onClose(id);
        }
    }

    return (
        <li className="nav-item">
            <NavLink className={classNames('nav-link', className, {disabled})}
                     tabIndex={disabled ? -1 : 0} to={to}>
                {!!icon && <span className={classNames('nav-item-icon me-1', icon)}/>}
                <span className="nav-item-text">{title}</span>
                {canClose && (
                    <span aria-label="Close" onClick={closeHandler} className="ms-2 bi-x-lg"/>
                )}
            </NavLink>
        </li>
    )
}

export default NavTabItem;
