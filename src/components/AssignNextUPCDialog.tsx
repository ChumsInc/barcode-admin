import {useId} from 'react';
import type {BarcodeItem} from "chums-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "react-bootstrap/Button";


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
                <Button onClick={onCancel} variant="secondary">Cancel</Button>
                <Button onClick={onConfirm} autoFocus variant="primary">Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}
export default AssignNextUPCDialog;
