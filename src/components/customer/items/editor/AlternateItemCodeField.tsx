import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import {useItemEditor} from "@/components/customer/items/editor/useItemEditor.ts";
import PasteButton from "@/components/customer/items/editor/PasteButton.tsx";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export default function AlternateItemCodeField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {sageItem, applySageField} = useItemEditor();
    const {canEdit} = useCustomerItems();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        if (canEdit) {
            updateValue({AltItemCode: ev.target.value});
        }
    }
    const clickHandler = () => {
        applySageField('Category1', 'AltItemCode')
    }
    return (
        <ItemInput field="AltItemCode" value={value.AltItemCode} label="Alt. Item Code"
                   onChange={changeHandler}>
            <PasteButton disabled={!sageItem || !canEdit} pasteValue={sageItem?.Category1}
                         onClick={clickHandler}/>
        </ItemInput>
    )
}
