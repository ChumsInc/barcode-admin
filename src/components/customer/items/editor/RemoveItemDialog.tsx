import type {BarcodeItem} from "chums-types";
import Button from "react-bootstrap/Button";
import {useSelector} from "react-redux";
import Modal from "react-bootstrap/Modal";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";

export interface RemoveItemDialogProps {
    item: BarcodeItem | null;
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function RemoveItemDialog({item, open, onConfirm, onCancel}: RemoveItemDialogProps) {
    const settings = useSelector(selectCustomerSettings);
    if (!settings || !item) {
        return null;
    }
    return (
        <Modal show={open} onHide={onCancel} centered
               aria-labelledby="confirm-delete-title" aria-describedby="confirm-delete-description">
            <Modal.Header closeButton>
                <Modal.Title id="confirm-delete-title">Confirm deletion of {item.ItemCode}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                This will remove '{item.ItemCode}' from {' '}
                <strong>{settings.ARDivisionNo}-{settings.CustomerNo}</strong> {settings.CustomerName}.
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCancel} size="sm" variant="secondary">Cancel</Button>
                <Button onClick={onConfirm} size="sm" variant="danger">Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
}
