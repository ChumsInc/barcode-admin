import {startTransition, useEffect, useId, useState} from 'react';
import {useAppDispatch} from "@/app/configureStore.ts";
import {useSelector} from "react-redux";
import {selectCanAssignNewUPC} from "../../../user";
import {selectCurrentCustomer, selectCustomerItem} from "../../selectors.ts";
import {assignNextUPC} from "../../actions.ts";
import {customerKey} from "@/utils/customer.ts";
import classNames from "classnames";
import Alert from "react-bootstrap/Alert";
import type {SearchItem} from "chums-types";
import AssignNextUPCDialog from "@/components/AssignNextUPCDialog.tsx";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

const AssignNextUPCButton = ({sageItem}: { sageItem: SearchItem | null }) => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const item = useSelector(selectCustomerItem);
    const canAssignUPC = useSelector(selectCanAssignNewUPC);
    const idNewItem = useId();
    const [open, setOpen] = useState(false);
    const [itemCode, setItemCode] = useState<string>('');

    useEffect(() => {
        startTransition(() => {
            setItemCode(item?.ItemCode ?? '')
        });
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
            <AssignNextUPCDialog item={item} open={open} onConfirm={onConfirm} onCancel={() => setOpen(false)}>
                <p>
                    This will assign the next available color UPC to <strong>{item.ItemCode}</strong> for {' '}
                    customer <strong>{currentCustomer.CustomerName} ({customerKey(currentCustomer)})</strong>.
                </p>
                <p>
                    If you need to assign a UPC code specific to this customer, update this item code to be customer
                    specific.
                    For example: {customerKey(currentCustomer)}-{item.ItemCode}
                </p>
                <InputGroup size="sm">
                    <InputGroup.Text as="label" htmlFor={idNewItem}>Item Code</InputGroup.Text>
                    <FormControl type="text" value={itemCode} onChange={(ev) => setItemCode(ev.target.value)}
                                 maxLength={45}/>
                </InputGroup>
                {!!sageItem?.UDF_UPC_BY_COLOR && (
                    <Alert variant="warning" className="mt-1">By Color UPC already exists, a custom item code is
                        required.</Alert>)}
            </AssignNextUPCDialog>
        </>
    )
}

export default AssignNextUPCButton;
