import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";

export default function CustomerPartField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({CustomerPart: ev.target.value});
    }

    return (
        <ItemInput field="CustomerPart" value={value.CustomerPart} label="Customer Part" onChange={changeHandler}/>
    )
}
