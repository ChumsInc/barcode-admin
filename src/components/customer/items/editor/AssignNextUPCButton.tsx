import {startTransition, useEffect, useId, useState} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {customerKey} from "@/utils/customer.ts";
import Alert from "react-bootstrap/Alert";
import type {BarcodeItem, SearchItem} from "chums-types";
import AssignNextUPCDialog from "@/components/AssignNextUPCDialog.tsx";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import {assignNextUPC} from "@/ducks/customer/actions.ts";
import {OverlayTrigger} from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";

const AssignNextUPCButton = ({sageItem}: { sageItem: SearchItem | null }) => {
    const dispatch = useAppDispatch();
    const {customerSettings, currentItem, canAssignNewUPC} = useCustomerItems();
    const {changed} = useEditorContext<BarcodeItem>();

    const idNewItem = useId();
    const [open, setOpen] = useState(false);
    const [itemCode, setItemCode] = useState<string>('');

    useEffect(() => {
        startTransition(() => {
            setItemCode(currentItem?.ItemCode ?? '')
        });
    }, [currentItem]);

    if (!customerSettings || !currentItem || !canAssignNewUPC || currentItem.InactiveItem === 'Y' || currentItem.ProductType === 'D') {
        return null;
    }

    const onConfirm = () => {
        setOpen(false);
        dispatch(assignNextUPC({...currentItem, customItemCode: itemCode}));
    }


    const disabled = !currentItem.ItemCode || !currentItem.ID || !!currentItem.UPC;
    if (changed) {
        return (
            <OverlayTrigger placement="top" overlay={<Tooltip>Save changes before assigning a new UPC code</Tooltip>}>
                <button type="button" className="btn btn-sm btn-outline-secondary" disabled aria-label="Save changes before assigning a new UPC code">
                    <span className="bi-house-gear-fill"/>
                </button>
            </OverlayTrigger>
        )
    }

    return (
        <>
            <button type="button"
                    className="btn btn-sm btn-warning"
                    title="Assign new custom UPC"
                    onClick={() => setOpen(true)}
                    disabled={disabled}>
                <span className="bi-house-gear-fill"/>
            </button>
            <AssignNextUPCDialog item={currentItem} open={open} onConfirm={onConfirm} onCancel={() => setOpen(false)}>
                <p>
                    This will assign the next available color UPC to <strong>{currentItem.ItemCode}</strong> for {' '}
                    customer <strong>{customerSettings.CustomerName} ({customerKey(customerSettings)})</strong>.
                </p>
                <p>
                    If you need to assign a UPC code specific to this customer, update this item code to be customer
                    specific.
                    For example: {customerKey(customerSettings)}-{currentItem.ItemCode}
                </p>
                <InputGroup size="sm">
                    <InputGroup.Text as="label" htmlFor={idNewItem}>Item Code</InputGroup.Text>
                    <FormControl type="text" value={itemCode} onChange={(ev) => setItemCode(ev.target.value)}
                                 maxLength={45}/>
                </InputGroup>
                {!!sageItem?.UDF_UPC_BY_COLOR && (
                    <Alert variant="warning" className="mt-1">
                        By Color UPC already exists, a custom item code is required.
                    </Alert>
                )}
            </AssignNextUPCDialog>
        </>
    )
}

export default AssignNextUPCButton;
