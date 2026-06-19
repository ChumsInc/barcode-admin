import {Col, Form, Row} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem, SearchItem} from "chums-types";
import {type ChangeEvent, startTransition, useCallback, useEffect, useId, useState} from "react";
import {useItemEditor} from "@/components/customer/items/editor/useItemEditor.ts";
import ExistingItemAlert from "@/components/customer/items/editor/ExistingItemAlert.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";
import ItemAutocomplete from "@/components/ItemAutocomplete.tsx";

export default function ItemField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {canEdit} = useCustomerItems()
    const {sageItem, setSageItem} = useItemEditor();
    const [locked, setLocked] = useState(true);
    const id = useId();

    const changeHandler = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({ItemCode: ev.target.value});
    }, [updateValue]);

    useEffect(() => {
        startTransition(() => {
            if (canEdit) {
                setLocked(value.ID !== 0);
            }
        })
    }, [value.ID, canEdit]);

    const lockHandler = () => {
        if (canEdit) {
            setLocked(!locked);
        }
    }

    const selectItemHandler = (item?: SearchItem | null) => {
        console.log('selectItemHandler()', item);
        setSageItem(item);
        if (item) {
            updateValue({ItemCode: item.ItemCode});
        }
    }

    return (
        <Form.Group as={Row} label="Item">
            <Form.Label column sm={4} htmlFor={id}>Item</Form.Label>
            <Col sm={8}>
                <ItemAutocomplete item={value?.ItemCode ?? ''} id={id}
                                  onChange={changeHandler}
                                  readOnly={locked || !canEdit}
                                  required
                                  onSelectItem={selectItemHandler}>
                    <button type="button" className="btn btn-outline-secondary"
                            disabled={!canEdit}
                            onClick={lockHandler}>
                        <span className={locked ? 'bi-lock-fill' : 'bi-pencil-fill'}/>
                    </button>
                </ItemAutocomplete>
                {(value?.ID || sageItem) &&
                    <small className="text-muted">{sageItem?.ItemCodeDesc ?? 'Invalid Sage Item'}</small>}
                <ExistingItemAlert/>
            </Col>
        </Form.Group>
    )
}
