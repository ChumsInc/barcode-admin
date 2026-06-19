import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import {useItemEditor} from "@/components/customer/items/editor/useItemEditor.ts";
import PasteButton from "@/components/customer/items/editor/PasteButton.tsx";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";

export default function DescriptionField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {sageItem, applySageField} = useItemEditor();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({ItemDescription: ev.target.value});
    }

    const clickHandler = () => {
        applySageField('ItemCodeDesc', 'ItemDescription')
    }

    return (
        <ItemInput field="ItemDescription" value={value.ItemDescription} label="Description"
                   onChange={changeHandler}>
            <PasteButton disabled={!sageItem} pasteValue={sageItem?.ItemCodeDesc}
                         onClick={clickHandler}/>
        </ItemInput>
    )
}
