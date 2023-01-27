import React from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {loadCustomer} from "./actions";
import {useSelector} from "react-redux";
import {selectCurrentCustomer, selectCustomerLoading} from "./selectors";
import {SpinnerButton} from "chums-components";

const ReloadCustomerButton = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const loading = useSelector(selectCustomerLoading);

    if (!currentCustomer) {
        return null;
    }

    return (
        <SpinnerButton type="button" size="sm" color="outline-primary"
                       spinning={loading}
                       onClick={() => dispatch(loadCustomer(currentCustomer?.id))}>
            Reload Customer
        </SpinnerButton>
    )
}

export default ReloadCustomerButton
