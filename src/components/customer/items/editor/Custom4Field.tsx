import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export default function Custom4Field() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {customerSettings} = useCustomerItems();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({Custom4: ev.target.value});
    }

    return (
        <ItemInput field="Custom4" value={value.Custom4}
                   label={customerSettings?.custom4Name ?? 'Custom 4'}
                   onChange={changeHandler}/>
    )
}
