import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";

export default function CustomerSKUField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({SKU: ev.target.value});
    }

    return (
        <ItemInput field="SKU" value={value.SKU} label="Customer SKU" onChange={changeHandler}/>
    )
}
