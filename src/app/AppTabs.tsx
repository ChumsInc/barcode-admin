import React, {useEffect} from 'react';
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "../ducks/customer/selectors";
import {useAppDispatch} from "./configureStore";
import {loadCustomer} from "../ducks/customer/actions";
import NavTabItem from "../components/NavTabItem";
import {Nav} from "react-bootstrap";


const AppTabs = () => {
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>();
    const customer = useSelector(selectCurrentCustomer);

    useEffect(() => {
        if (!!id && id !== customer?.id.toString()) {
            dispatch(loadCustomer(id));
        }
    }, [id]);

    return (
        <Nav variant="tabs" className="justify-content-center mb-3" defaultActiveKey={'home'} activeKey={id}>
            <NavTabItem to="/" id="home">Customers</NavTabItem>
            <NavTabItem to={`/${customer?.id ?? 0}/settings`} id="settings">
                {customer?.CustomerName ?? 'Customer Settings'}
            </NavTabItem>
            <NavTabItem id="orders" to={`${customer?.id ?? 0}/orders`} disabled={!customer?.id}>
                Order Stickers
            </NavTabItem>
            <NavTabItem id="items" to={`${customer?.id ?? 0}/items`} disabled={!customer?.id}>
                Customer Items
            </NavTabItem>
        </Nav>
    )
}

export default AppTabs;
