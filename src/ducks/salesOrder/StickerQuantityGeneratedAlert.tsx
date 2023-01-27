import React from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {selectQtyGenerated} from "./selectors";
import {Alert} from "chums-components";
import {dismissQtyGenerated} from "./actions";

const StickerQuantityGeneratedAlert = () => {
    const dispatch = useAppDispatch();
    const qtyGenerated = useSelector(selectQtyGenerated);
    if (qtyGenerated === null) {
        return (
            <div>
                <strong><span className="bi-info-circle me-1" />Note: </strong>
                Generating stickers will clear all existing stickers for this order.
            </div>
        );
    }
    return (
        <Alert color={qtyGenerated === 0 ? 'danger' : 'success'} canDismiss
               onDismiss={() => dispatch(dismissQtyGenerated())}>
            <strong>Qty Generated</strong>: {qtyGenerated}
        </Alert>
    )
}

export default StickerQuantityGeneratedAlert;
