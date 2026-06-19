import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export default function Custom3Field() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {customerSettings} = useCustomerItems();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({Custom3: ev.target.value});
    }

    return (
        <ItemInput field="Custom3" value={value.Custom3}
                   label={customerSettings?.custom3Name ?? 'Custom 3'}
                   onChange={changeHandler}/>
    )
}
