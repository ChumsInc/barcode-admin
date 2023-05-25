import Decimal from "decimal.js";
import {SortProps} from "chums-components";
import {BarcodeSODetailLine, SODetailTableField} from "../../types";

export const itemStickerQty = (row: Pick<BarcodeSODetailLine, 'ItemType' | 'Quantity' | 'UnitOfMeasureConvFactor'>, extra: number): number | null => {
    if (row.ItemType !== '1') {
        return null;
    }
    const extraMod = new Decimal(extra).div(100).add(1);
    const qty = new Decimal(row.Quantity).times(row.UnitOfMeasureConvFactor);
    return qty.times(extraMod).floor().toNumber();
}


export const detailSorter = (sort: SortProps<SODetailTableField>) => (a: BarcodeSODetailLine, b: BarcodeSODetailLine) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
    case 'LineKey':
    case 'LineSeqNo':
        return (a[field] > b[field] ? 1 : -1) * sortMod;
    case 'ItemCode':
    case 'BinLocation':
    case 'UnitOfMeasure':
        return (
            a[field].toLowerCase() === b[field].toLowerCase()
                ? (a.LineSeqNo > b.LineSeqNo ? 1 : -1)
                : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
        ) * sortMod;
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
    case 'Custom4':
        if (!a.item || !b.item) {
            return (a.LineSeqNo > b.LineSeqNo ? 1 : -1) * sortMod;
        }
        return (
            a.item[field].toLowerCase() === b.item[field].toLowerCase()
                ? (a.LineSeqNo > b.LineSeqNo ? 1 : -1)
                : (a.item[field].toLowerCase() > b.item[field].toLowerCase() ? 1 : -1)
        ) * sortMod;
    default:
        return (a.LineSeqNo > b.LineSeqNo ? 1 : -1) * sortMod;
    }
}



