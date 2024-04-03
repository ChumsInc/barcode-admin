import React, {useEffect, useId, useState} from 'react';
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
import {assignNextUPC, saveCustomerItem} from "./actions";
import {customerKey} from "../../utils/customer";
import classNames from "classnames";
import {SageItem} from "../../types";
import {formatGTIN} from "@chumsinc/gtin-tools";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

const AssignNextUPCButton = ({sageItem}:{sageItem:SageItem|null}) => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const item = useSelector(selectCustomerItem);
    const canAssignUPC = useSelector(selectCanAssignNewUPC);
    const id = useId();
    const [open, setOpen] = useState(false);
    const [itemCode, setItemCode] = useState<string>('');

    useEffect(() => {
        setItemCode(item?.ItemCode ?? '')
    }, [item]);

    if (!currentCustomer || !item || !canAssignUPC || item.InactiveItem === 'Y' || item.ProductType === 'D') {
        return null;
    }

    const onConfirm = () => {
        setOpen(false);
        dispatch(assignNextUPC({...item, customItemCode: itemCode}));
    }


    const disabled = !item.ItemCode || !item.ID || !!item.UPC;
    return (
        <>
            <button type="button"
                    className={classNames("btn btn-sm", {'btn-warning': !disabled, 'btn-outline-warning': disabled})}
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
                    <DialogContentText sx={{mt: 2}}>
                        If you need to assign a UPC code specific to this customer, update this item code to be customer specific.
                        For example: {customerKey(currentCustomer)}-{item.ItemCode}
                    </DialogContentText>
                    <TextField required margin="dense" label="Item Code" type="text" variant="standard"
                               inputProps={{maxLength: 45}} fullWidth
                               value={itemCode} onChange={(ev) => setItemCode(ev.target.value)} />
                    {!!sageItem?.UDF_UPC_BY_COLOR && (<Alert severity="warning">By Color UPC already exists, a custom item code is required.</Alert>)}
                </DialogContent>
                <DialogActions>
                    <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="button" onClick={onConfirm}
                            disabled={!!sageItem?.UDF_UPC_BY_COLOR && sageItem.ItemCode === itemCode}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AssignNextUPCButton;
