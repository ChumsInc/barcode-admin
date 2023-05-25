import React from 'react';
import {BarcodeItem} from "chums-types";
import classNames from "classnames";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";

const ItemStickerIcons = ({item}: { item?: BarcodeItem }) => {
    const customer = useSelector(selectCurrentCustomer);
    const {itemSticker, bagSticker, caseSticker} = item ?? {};
    return (
        <div>
            <span className={classNames('me-1', {
                'bi-1-square': !itemSticker,
                'bi-1-square-fill': itemSticker || customer?.itemStickerAll,
                'text-black-50': !itemSticker,
                'text-primary': itemSticker || customer?.itemStickerAll
            })}/>
            <span className={classNames('me-1', {
                'bi-bag': !bagSticker,
                'bi-bag-fill': bagSticker,
                'text-black-50': !bagSticker || customer?.bagStickerAll,
                'text-primary': bagSticker || customer?.bagStickerAll
            })}/>
            <span className={classNames('me-1', {
                'bi-box': !caseSticker,
                'bi-box-fill': caseSticker || customer?.caseStickerAll,
                'text-black-50': !caseSticker,
                'text-primary': caseSticker || customer?.caseStickerAll
            })}/>
        </div>
    )
}

export default ItemStickerIcons;
