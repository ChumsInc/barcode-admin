import {type ReactNode, startTransition, useCallback, useEffect, useMemo, useState} from "react";
import ItemEditorContext from "@/components/customer/items/editor/ItemEditorContext.tsx";
import type {BarcodeItem, SearchItem} from "chums-types";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCanAssignNewUPC, selectCanEdit} from "@/ducks/user";
import numeral from "numeral";
import {fetchItemLookup} from "@/api/item.ts";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export interface ItemEditorProviderProps {
    children: ReactNode;
}

export default function ItemEditorProvider({children}: ItemEditorProviderProps) {
    const [sageItem, setSageItem] = useState<SearchItem | null>(null);
    const {updateValue} = useEditorContext<BarcodeItem>()
    const canEdit = useAppSelector(selectCanEdit);
    const canAssignNewUPC = useAppSelector(selectCanAssignNewUPC);
    const {currentItem} = useCustomerItems();
    const loadSageItem = useCallback(async (item:BarcodeItem) => {
        const items = await fetchItemLookup(item.ItemCode, true);
        setSageItem(items[0] ?? null);
    }, []);

    useEffect(() => {
        startTransition(() => {
            if (currentItem && currentItem.ItemCode) {
                loadSageItem(currentItem).catch(e => console.error(e));
            }
        })
    }, [currentItem, loadSageItem]);

    const setSageItemHandler = useCallback((item:SearchItem|null|undefined) => {
        setSageItem(item ?? null)
    }, [])


    const applySageField = useCallback((field: keyof SearchItem, itemField: keyof BarcodeItem) => {
        if (sageItem?.[field] !== undefined) {
            switch (field) {
                case 'SuggestedRetailPrice': {
                    if (sageItem.SuggestedRetailPrice) {
                        updateValue({MSRP: numeral(sageItem.SuggestedRetailPrice).format('0.00')});
                    }
                    return;
                }
                default:
                    updateValue({[itemField]: sageItem?.[field]});
            }
        }
    }, [sageItem, updateValue])

    const value = useMemo(() => ({
            sageItem,
            setSageItem: setSageItemHandler,
            applySageField,
            canEdit,
            canAssignNewUPC,
        }),
        [sageItem, setSageItemHandler, applySageField, canEdit, canAssignNewUPC]
    );

    return (
        <ItemEditorContext value={value}>
            {children}
        </ItemEditorContext>
    )
}
