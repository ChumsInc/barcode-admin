import React, {useId, useState} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCanAssignNewUPC} from "../user";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import {selectCurrentCustomer, selectCustomerItem} from "./selectors";
import {assignNextUPC} from "./actions";
import {customerKey} from "../../utils/customer";
import classNames from "classnames";

const AssignNextUPCButton = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const item = useSelector(selectCustomerItem);
    const canAssignUPC = useSelector(selectCanAssignNewUPC);
    const id = useId();
    const [open, setOpen] = useState(false);

    if (!currentCustomer || !item || !canAssignUPC || item.InactiveItem === 'Y' || item.ProductType === 'D') {
        return null;
    }

    const onConfirm = () => {
        setOpen(false);
        dispatch(assignNextUPC(item));
    }

    const disabled = !item.ItemCode || !item.ID || !!item.UPC;
    return (
        <>
            <button type="button"
                    className={classNames("btn btn-sm btn-warning", {'btn-warning': !disabled, 'btn-outline-warning': disabled})}
                    title="Assign new custom UPC"
                    onClick={() => setOpen(true)}
                    disabled={disabled}>
                <span className="bi-house-gear-fill"/>
            </button>
            <Dialog open={open} onClose={() => setOpen(false)}
                    aria-labelledby={id}>
                <DialogTitle id={id}>
                    Confirm assign next color UPC to {item.ItemCode}?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will assign the next available color UPC to <strong>{item.ItemCode}</strong> for {' '}
                        customer <strong>{currentCustomer.CustomerName} ({customerKey(currentCustomer)})</strong>.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={onConfirm} autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AssignNextUPCButton;
