import React, {useId} from 'react';
import {BarcodeItem} from "chums-types";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";


export interface AssignNextUPCDialogProps {
    item: BarcodeItem | null;
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const AssignNextUPCDialog = ({item, open, onConfirm, onCancel}: AssignNextUPCDialogProps) => {
    const id = useId();
    if (!item) {
        return null;
    }
    return (
        <Dialog open={open} onClose={onCancel}
                aria-labelledby={id}>
            <DialogTitle id={id}>
                Confirm assign next color UPC to {item.ItemCode}?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This will assign the next available color UPC to <strong>{item.ItemCode}</strong>.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm} autoFocus>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}
export default AssignNextUPCDialog;
