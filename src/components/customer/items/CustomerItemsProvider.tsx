import {type ReactNode, startTransition, useCallback, useEffect, useMemo, useState} from "react";
import type {BarcodeItem} from "chums-types";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectItems} from "@/ducks/customer/customerItemsSlice.ts";
import CustomerItemsContext, {
    type CustomerItemsContextProps
} from "@/components/customer/items/CustomerItemsContext.tsx";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";
import {useTableFields} from "@chumsinc/sortable-tables";
import {newItem} from "@/ducks/customer/utils.ts";
import {selectCanAssignNewUPC, selectCanEdit} from "@/ducks/user";

export interface CustomerItemsProviderProps {
    children: ReactNode;
}

export default function CustomerItemsProvider({children}: CustomerItemsProviderProps) {
    const customerSettings = useAppSelector(selectCustomerSettings);
    const canEdit = useAppSelector(selectCanEdit);
    const canAssignNewUPC = useAppSelector(selectCanAssignNewUPC);
    const [fields] = useTableFields<BarcodeItem>()
    const items = useAppSelector(selectItems);
    const [currentItem, setCurrentItem] = useState<BarcodeItem>({...newItem, CustomerID: customerSettings?.id});

    const setCurrentItemHandler = useCallback((item: BarcodeItem | null) => {
        setCurrentItem(item ?? {...newItem, CustomerID: customerSettings?.id});
    }, [customerSettings])

    useEffect(() => {
        startTransition(() => {
            const item = items.find(i => i.ID === currentItem?.ID);
            if (currentItem?.ID && !item) {
                setCurrentItemHandler(null);
            }
        })
    }, [items, currentItem, setCurrentItemHandler]);

    const value = useMemo<CustomerItemsContextProps>(() => ({
        customerSettings,
        fields,
        items,
        currentItem,
        setCurrentItem: setCurrentItemHandler,
        canEdit: canEdit && (customerSettings?.CustomerNo !== 'MSRP'),
        canAssignNewUPC,
    }), [items, currentItem, fields, setCurrentItemHandler, customerSettings, canEdit, canAssignNewUPC]);

    return (
        <CustomerItemsContext value={value}>
            {children}
        </CustomerItemsContext>
    )

}
