import Decimal from "decimal.js";
import type {BarcodeItem, SortFactory} from "chums-types";
import type {BarcodeSODetailLine} from "../../types";

export const itemStickerQty = (row: Pick<BarcodeSODetailLine, 'ItemType' | 'Quantity' | 'UnitOfMeasureConvFactor'>, extra: number): number | null => {
    if (row.ItemType !== '1') {
        return null;
    }
    const extraMod = new Decimal(extra).div(100).add(1);
    const qty = new Decimal(row.Quantity).times(row.UnitOfMeasureConvFactor);
    return qty.times(extraMod).floor().toNumber();
}

export const detailSorter: SortFactory<BarcodeSODetailLine> = (sortProps) => (a, b) => {
    const sortMod = sortProps.ascending ? 1 : -1;
    const field = sortProps.field as keyof BarcodeSODetailLine;


    switch (field) {
        case 'LineKey':
        case 'LineSeqNo':
            return a[field].localeCompare(b[field]) * sortMod;
        case 'ItemCode':
        case 'BinLocation':
        case 'UnitOfMeasure':
            return (
                a[field].toLowerCase().localeCompare(b[field].toLowerCase()) === 0
                    ? (a.ItemCode.localeCompare(b.ItemCode) === 0
                            ? a.LineSeqNo.localeCompare(b.LineSeqNo)
                            : a.ItemCode.localeCompare(b.ItemCode)
                    )
                    : a[field].toLowerCase().localeCompare(b[field].toLowerCase())
            ) * sortMod;
    }
    if (!a.item || !b.item) {
        return a.LineSeqNo.localeCompare(b.LineSeqNo) * sortMod;
    }

    const itemField = sortProps.field.replace('item.', '') as keyof BarcodeItem;
    switch (itemField) {
        case 'AltItemCode':
        case 'ItemDescription':
        case 'Color':
        case 'SKU':
        case 'CustomerPart':
        case 'UPC':
        case 'MSRP':
        case 'Custom1':
        case 'Custom2':
        case 'Custom3':
        case 'Custom4': {
            const compared = a.item[itemField].toLowerCase().localeCompare(b.item[itemField].toLowerCase())
            if (compared !== 0) {
                return a.LineSeqNo.localeCompare(b.LineSeqNo) * sortMod;
            }
            return compared * sortMod;
        }
    }
    return a.LineSeqNo.localeCompare(b.LineSeqNo) * sortMod;
}



