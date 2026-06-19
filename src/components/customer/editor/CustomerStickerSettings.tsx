import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeCustomerSettings} from "chums-types";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCanEdit} from "@/ducks/user";
import {type ChangeEvent, useId} from "react";
import StickerToggleButton from "@/components/customer/common/StickerToggleButton.tsx";
import FormCheck from "react-bootstrap/FormCheck";

export default function CustomerStickerSettings() {
    const {value: customer, updateValue} = useEditorContext<BarcodeCustomerSettings>();
    const id = useId();
    const canEdit = useAppSelector(selectCanEdit);
    const changeHandler = (field: keyof BarcodeCustomerSettings) => (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({[field]: ev.target.checked});
    }

    return (
        <div className="row g-3 justify-content-between">
            <div className="col-12 col-lg-6">
                <div className="btn-group btn-group-sm">
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
                <div className="text-secondary">
                    <small>Require stickers for all items if checked</small>
                </div>
            </div>
            <div className="col-12 col-lg-6">
                <FormCheck id={id} type="checkbox" readOnly={!canEdit}
                           checked={customer.includeQtyInSticker ?? false}
                           onChange={changeHandler('includeQtyInSticker')}
                           label="Include Quantity in Sticker Data" />
                <div className="text-secondary">
                    <small>This requires the sticker to be set to use quantity from the data record when printing.</small>
                </div>
            </div>
        </div>
    )
}
