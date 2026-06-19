import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export default function Custom1Field() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {customerSettings} = useCustomerItems();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({Custom1: ev.target.value});
    }

    return (
        <ItemInput field="Custom1" value={value.Custom1}
                   label={customerSettings?.custom1Name ?? 'Custom 1'}
                   onChange={changeHandler}/>
    )
}
