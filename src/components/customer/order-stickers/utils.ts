import type {BarcodeSODetailLine} from "@/src/types.ts";
import type {BarcodeItem, SalesOrderDetailLine} from "chums-types";
import type {DetailRecord} from "@/components/customer/order-stickers/types.ts";
import {itemStickerQty} from "@/ducks/salesOrder/utils.ts";
import Decimal from "decimal.js";

export function buildDetailRecord(orderDetail: SalesOrderDetailLine[], customerItems: BarcodeItem[], extra: number): DetailRecord {
    const detail: DetailRecord = {};
    orderDetail.forEach(od => {
        const item = customerItems.find(i => i.ItemCode === od.ItemCode);
        const quantity = new Decimal(od.QuantityOrdered).sub(od.QuantityShipped).toString();
        detail[od.LineKey] = {
            ...od,
            BinLocation: od.BinLocation ?? '',
            item,
            Quantity: quantity,
            selected: false,
            stickerQty: itemStickerQty({
                ItemType: od.ItemType,
                Quantity: quantity,
                UnitOfMeasureConvFactor: od.UnitOfMeasureConvFactor
            }, extra)
        };
    })
    return detail;
}

export function isAllChecked(lines: BarcodeSODetailLine[]):boolean|null {
    const count = lines.length;
    const checked = lines.filter(od => od.selected).length;
    return count === checked
        ? true
        : count === 0 ? false : null;
}
