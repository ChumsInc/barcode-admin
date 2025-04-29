import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import Alert from "react-bootstrap/Alert";

const InactiveCustomerAlert = () => {
    const customer = useSelector(selectCurrentCustomer);
    if (!customer || customer.active) {
        return null;
    }

    return (
        <Alert variant="warning"><span className="bi-toggle-off"></span> This account is disabled.</Alert>
    )
}
export default InactiveCustomerAlert;
