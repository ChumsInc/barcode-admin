import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import {useItemEditor} from "@/components/customer/items/editor/useItemEditor.ts";
import PasteButton from "@/components/customer/items/editor/PasteButton.tsx";
import type {ChangeEvent} from "react";
import ItemInput from "@/components/customer/items/editor/ItemInput.tsx";
import numeral from "numeral";
import {Decimal} from "decimal.js";

export default function MSRPField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {sageItem, applySageField} = useItemEditor();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({MSRP: ev.target.value});
    }

    const clickHandler = () => {
        applySageField('SuggestedRetailPrice', 'MSRP')
    }

    const priceMatch = value.MSRP && sageItem?.SuggestedRetailPrice
        ? new Decimal(value.MSRP ?? 0).eq(sageItem?.SuggestedRetailPrice ?? 0)
        : false;
    const suggestedPrice = sageItem?.SuggestedRetailPrice ? numeral(sageItem.SuggestedRetailPrice).format('0,0.00') : null;

    return (
        <ItemInput field="MSRP" value={value.MSRP} label="MSRP"
                   onChange={changeHandler}>
            {!!suggestedPrice && !priceMatch && (
                <div className="input-group-text text-danger">
                    <span className="bi-exclamation-triangle-fill me-1"/>
                    {suggestedPrice}
                </div>
            )}
            <PasteButton disabled={!sageItem}
                         pasteValue={suggestedPrice}
                         onClick={clickHandler}/>
        </ItemInput>
    )
}
