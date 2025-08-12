import type {BarcodeItem} from "chums-types";
import classNames from "classnames";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "./selectors";

const ItemStickerIcons = ({item}: { item?: BarcodeItem }) => {
    const customer = useSelector(selectCurrentCustomer);
    const {itemSticker = false, bagSticker = false, caseSticker = false} = item ?? {};
    const {itemStickerAll = false, bagStickerAll = false, caseStickerAll = false} = customer ?? {};
    return (
        <div>
            <span className={classNames('me-1', {
                'bi-1-square': !(itemSticker || itemStickerAll),
                'text-black-50': !(itemSticker || itemStickerAll),
                'bi-1-square-fill': itemSticker || itemStickerAll,
                'text-primary': itemSticker || itemStickerAll
            })}/>
            <span className={classNames('me-1', {
                'bi-bag': !(bagSticker || bagStickerAll),
                'text-secondary': !(bagSticker || bagStickerAll),
                'bi-bag-fill': bagSticker || bagStickerAll,
                'text-primary': bagSticker || bagStickerAll
            })}/>
            <span className={classNames('me-1', {
                'bi-box': !(caseSticker || caseStickerAll),
                'text-secondary': !(caseSticker || caseStickerAll),
                'bi-box-fill': caseSticker || caseStickerAll,
                'text-primary': caseSticker || caseStickerAll
            })}/>
        </div>
    )
}

export default ItemStickerIcons;
