import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {BarcodeItem} from "chums-types";
import type {ChangeEvent} from "react";
import {Col, Form, Row} from "react-bootstrap";
import {useCustomerItems} from "@/components/customer/items/useCustomerItems.ts";
import StickerToggleButton from "@/components/customer/common/StickerToggleButton.tsx";

export default function StickerTogglesField() {
    const {value, updateValue} = useEditorContext<BarcodeItem>();
    const {customerSettings, canEdit} = useCustomerItems();

    const changeHandler = (field: keyof Pick<BarcodeItem, 'itemSticker' | 'bagSticker' | 'caseSticker'>) => (ev: ChangeEvent<HTMLInputElement>) => {
        if (canEdit) {
            updateValue({[field]: ev.target.checked});
        }
    }

    return (
        <Form.Group as={Row} label="Stickers">
            <Form.Label column sm={4} role="presentation">Stickers</Form.Label>
            <Col sm={8}>
                <div className="btn-group btn-group-sm" role="group" aria-label="Toggle Required Stickers">
                    <StickerToggleButton checked={value.itemSticker || customerSettings?.itemStickerAll || false}
                                         onChange={changeHandler('itemSticker')} icon="bi-1-square"
                                         disabled={customerSettings?.itemStickerAll}/>
                    <StickerToggleButton checked={value.bagSticker || customerSettings?.bagStickerAll || false}
                                         onChange={changeHandler('bagSticker')} icon="bi-bag"
                                         disabled={customerSettings?.bagStickerAll}/>
                    <StickerToggleButton checked={value.caseSticker || customerSettings?.caseStickerAll || false}
                                         onChange={changeHandler('caseSticker')} icon="bi-box"
                                         disabled={customerSettings?.caseStickerAll}/>
                </div>
            </Col>
        </Form.Group>
    )
}
