import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import {useItemEditor} from "@/components/customer/items/editor/useItemEditor.ts";
import PasteButton from "@/components/customer/items/editor/PasteButton.tsx";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";
import {formatGTIN} from "@chumsinc/gtin-tools";
import AssignNextUPCButton from "@/components/customer/items/editor/AssignNextUPCButton.tsx";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";

export default function UPCField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {sageItem, applySageField} = useItemEditor();
    const {canEdit} = useCustomerItems()

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        if (canEdit) {
            updateValue({UPC: ev.target.value});
        }
    }
    const clickHandler = () => {
        applySageField('UDF_UPC', 'UPC')
    }
    const byColorClickHandler = () => {
        applySageField('UDF_UPC_BY_COLOR', 'UPC')
    }

    return (
        <ItemInput field="UPC" value={value.UPC} label="UPC"
                   helpText="Automatically calculates check digits for numeric codes length 11-14, 16-18"
                   onChange={changeHandler}>
            <PasteButton disabled={!sageItem || !canEdit} pasteValue={formatGTIN(sageItem?.UDF_UPC ?? '')}
                         onClick={clickHandler}/>
            <PasteButton disabled={!sageItem || !canEdit} pasteValue={formatGTIN(sageItem?.UDF_UPC_BY_COLOR ?? '')}
                         variant="info"
                         onClick={byColorClickHandler}/>
            <AssignNextUPCButton sageItem={sageItem}/>
        </ItemInput>
    )
}
