import type {BarcodeItem} from "chums-types";
import Alert from "react-bootstrap/Alert";
import {startTransition, useCallback, useEffect, useState} from "react";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";

const ExistingItemAlert = () => {
    const {items} = useCustomerItems();
    const {value} = useEditorContext<BarcodeItem>();
    const [match, setMatch] = useState<BarcodeItem | null>(null);

    const findMatch = useCallback((item: BarcodeItem) => {
        const existing = items.find(i => i.ItemCode === item.ItemCode);
        if (!existing || existing?.ID === item.ID) {
            setMatch(null);
            return;
        }
        setMatch(existing);
    }, [items])

    useEffect(() => {
        startTransition(() => {
            findMatch(value);
        })
    }, [value, findMatch]);

    if (!match) {
        return null;
    }

    return (
        <Alert variant="danger">
            Item '{value.ItemCode}' already exists for this customer.
        </Alert>
    )
}

export default ExistingItemAlert;
