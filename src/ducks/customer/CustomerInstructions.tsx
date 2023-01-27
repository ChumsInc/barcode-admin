import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";
import {customerKey} from "../../utils/customer";
import {Alert} from "chums-components";
import AlertTitle from "@mui/material/AlertTitle";

const CustomerInstructions = () => {
    const current = useSelector(selectCurrentCustomer);
    if (!current || !current.SpecialInstructions) {
        return null
    }
    return (
        <Alert color="warning" >
            <strong><span className="bi-info-circle me-1" />Special Instructions</strong>
            <div style={{whiteSpace: 'pre-wrap'}} className="mt-1">{current.SpecialInstructions}</div>
        </Alert>
    )
}

export default CustomerInstructions
