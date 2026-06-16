import {type ReactNode, useId} from 'react';
import type {BarcodeItem} from "chums-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


export interface AssignNextUPCDialogProps {
    item: BarcodeItem | null;
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    children?: ReactNode;
}

const AssignNextUPCDialog = ({item, open, onConfirm, onCancel, children}: AssignNextUPCDialogProps) => {
    const id = useId();
    if (!item) {
        return null;
    }
    return (
        <Modal show={open} onHide={onCancel} centered
               aria-labelledby={id}>
            <Modal.Header closeButton>
                <Modal.Title id={id}>Confirm assign next color UPC to {item.ItemCode}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onCancel} variant="secondary" size="sm">Cancel</Button>
                <Button onClick={onConfirm} autoFocus variant="primary" size="sm">Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
}
export default AssignNextUPCDialog;
