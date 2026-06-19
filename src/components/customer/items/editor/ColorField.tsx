import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";

export default function ColorField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({Color: ev.target.value});
    }

    return (
        <ItemInput field="Color" value={value.Color} label="Color" onChange={changeHandler}/>
    )
}
