import React from 'react';
import {BarcodeItem} from "chums-types";
import {useSelector} from "react-redux";
import {selectCustomerItems} from "./selectors";
import Alert from "@mui/material/Alert";

const ExistingItemAlert = ({item}:{item:BarcodeItem}) => {
    const items = useSelector(selectCustomerItems);
    const match = items[item.ItemCode];
    if (!match || match.ID === item.ID) {
        return null;
    }
    return <Alert severity="error">Item '{item.ItemCode}' already exists for this customer.</Alert>
}

export default ExistingItemAlert;
