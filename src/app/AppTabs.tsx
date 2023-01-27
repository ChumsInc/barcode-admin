import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {TabList} from 'chums-components';
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "../ducks/customer/selectors";
import {useAppDispatch} from "./configureStore";
import {loadCustomer} from "../ducks/customer/actions";
import NavTabItem from "../components/NavTabItem";
import {loadCustomers} from "../ducks/customers/actions";


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
        <TabList className="justify-content-center mb-3">
            <NavTabItem id={'home'} to={'/'} title={'Customers'}/>
            <NavTabItem id={'settings'} title={customer?.CustomerName ?? 'Customer Settings'}
                        to={`/${customer?.id ?? 0}/settings`}/>
            <NavTabItem id={'orders'} title={'Order Stickers'} disabled={!customer?.id}
                        to={`/${customer?.id ?? 0}/orders`}/>
            <NavTabItem id={'items'} title={'Customer Items'} disabled={!customer?.id}
                        to={`/${customer?.id ?? 0}/items`}/>
        </TabList>
    )
}

export default AppTabs;
