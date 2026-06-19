import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export default function Custom2Field() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {customerSettings} = useCustomerItems();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({Custom2: ev.target.value});
    }

    return (
        <ItemInput field="Custom2" value={value.Custom2}
                   label={customerSettings?.custom2Name ?? 'Custom 2'}
                   onChange={changeHandler}/>
    )
}
