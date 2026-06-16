import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCanEdit} from "@/ducks/user";
import type {ChangeEvent} from "react";
import StickerToggleButton from "@/ducks/customer/StickerToggleButton.tsx";

export default function CustomerStickerSettings() {
    const {value: customer, updateValue} = useEditorContext<BarcodeCustomerSettings>();
    const canEdit = useAppSelector(selectCanEdit);
    const changeHandler = (field: keyof BarcodeCustomerSettings) => (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({[field]: ev.target.checked});
    }

    return (
        <div>
            <div className="btn-group btn-group-sm me-5">
                <StickerToggleButton checked={customer.caseStickerAll ?? false}
                                     onChange={changeHandler('caseStickerAll')} icon="bi-box"
                                     title="Require Case Stickers"
                                     disabled={!canEdit}/>
                <StickerToggleButton checked={customer.bagStickerAll ?? false}
                                     onChange={changeHandler('bagStickerAll')} icon="bi-bag"
                                     title="Require Bag Stickers"
                                     disabled={!canEdit}/>
                <StickerToggleButton checked={customer.itemStickerAll ?? false}
                                     onChange={changeHandler('itemStickerAll')} icon="bi-1-square"
                                     title="Require Item Stickers"
                                     disabled={!canEdit}/>
            </div>
            <small>Require stickers for all items if checked</small>
        </div>
    )
}
