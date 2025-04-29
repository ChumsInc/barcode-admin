import React from 'react';
import classNames from "classnames";
import {NavLink, NavLinkProps} from "react-router";
import {NavItem} from "react-bootstrap";

export interface NavTabItemProps extends NavLinkProps {
    id: string;
    to: string;
    icon?: string;
    canClose?: boolean;
    disabled?: boolean;
    onClose?: (id?: string) => void;
    children: React.ReactNode;
}

const NavTabItem = ({id, to, title, icon, className, canClose, disabled, onClose, children}: NavTabItemProps) => {
    const closeHandler = () => {
        if (onClose) {
            onClose(id);
        }
    }

    return (
        <NavItem>
            <NavLink className={classNames('nav-link', className, {disabled})}
                     tabIndex={disabled ? -1 : 0} to={to}>
                {!!icon && <span className={classNames('nav-item-icon me-1', icon)}/>}
                <span className="nav-item-text">{children}</span>
                {canClose && (
                    <span aria-label="Close" onClick={closeHandler} className="ms-2 bi-x-lg"/>
                )}
            </NavLink>
        </NavItem>
    )
}

export default NavTabItem;
