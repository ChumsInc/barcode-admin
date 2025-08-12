import type {BarcodeItem} from "chums-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";

export interface RemoveItemDialogProps {
    item:BarcodeItem|null;
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const RemoveItemDialog = ({item, open, onConfirm, onCancel}:RemoveItemDialogProps) => {
    const settings = useSelector(selectCurrentCustomer);
    if (!settings || !item) {
        return null;
    }
    return (
        <Dialog open={open} onClose={onCancel}
                aria-labelledby="confirm-delete-title" aria-describedby="confirm-delete-description">
            <DialogTitle id="confirm-delete-title">
                Confirm deletion of {item.ItemCode}?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This will remove '{item.ItemCode}' from {' '}
                    <strong>{settings.ARDivisionNo}-{settings.CustomerNo}</strong> {settings.CustomerName}.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm} autoFocus>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}
export default RemoveItemDialog;
