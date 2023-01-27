import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import {Alert} from "chums-components";

const InactiveCustomerAlert = () => {
    const customer = useSelector(selectCurrentCustomer);
    if (!customer || customer.active) {
        return null;
    }

    return (
        <Alert color="warning"><span className="bi-toggle-off"></span> This account is disabled.</Alert>
    )
}
export default InactiveCustomerAlert;
