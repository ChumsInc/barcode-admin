import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchSalesOrder, postOrderStickers} from "@/api/order-stickers";
import type {
    BarcodeSalesOrder,
    BarcodeSODetailLine,
    BarcodeSODetailRecord,
    BarcodeSOLineItem,
    GenerateStickerProps,
    SalesOrderDetailBarcodeItem
} from "../../types";
import type {BarcodeItem, SortProps} from "chums-types";
import type {RootState} from "@/app/configureStore";
import Decimal from "decimal.js";
import {
    selectExtraQuantity,
    selectSalesOrder,
    selectSalesOrderDetailItems,
    selectSalesOrderLoading,
    selectShipTo
} from "./selectors";
import {itemStickerQty} from "./utils";
import {selectCustomerSettings} from "@/ducks/customer/customerSettingsSlice.ts";
import {selectItems} from "@/ducks/customer/customerItemsSlice.ts";

export function parseSalesOrderLines(items: BarcodeItem[], detail: SalesOrderDetailBarcodeItem[], extra: number): BarcodeSODetailLine[] {
    return detail.map(row => {
        const {
            LineKey,
            LineSeqNo,
            ItemCode,
            CommentText,
            ItemType,
            BinLocation,
            UnitOfMeasure,
            UnitOfMeasureConvFactor,
            WarehouseCode,
            QuantityOrdered,
            QuantityShipped,
            UDF_SHIP_CODE,
        } = row;
        const Quantity = new Decimal(QuantityOrdered).sub(QuantityShipped).toString();
        const item = items.find(i => i.ItemCode === ItemCode);
        const stickerQty = item
            ? itemStickerQty({ItemType, Quantity, UnitOfMeasureConvFactor}, extra)
            : null;
        return {
            LineKey,
            LineSeqNo,
            ItemCode,
            ItemCodeDesc: row.ItemCodeDesc,
            WarehouseCode,
            CommentText,
            ItemType,
            BinLocation: BinLocation ?? '',
            UnitOfMeasure,
            UnitOfMeasureConvFactor,
            QuantityOrdered,
            QuantityShipped,
            Quantity,
            item,
            selected: false,
            stickerQty,
            UDF_SHIP_CODE,
        }
    })
}

export const loadSalesOrder = createAsyncThunk<BarcodeSalesOrder | null, string>(
    'salesOrder/load',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const items = selectItems(state);
        const extra = selectExtraQuantity(state);
        const so = await fetchSalesOrder(arg);
        if (!so) {
            return null
        }
        const {
            ARDivisionNo,
            CustomerNo,
            BillToName,
            SalesOrderNo,
            CustomerPONo,
            ShipExpireDate,
            OrderStatus,
            detail
        } = so;
        const lines = parseSalesOrderLines(items, detail, extra);
        return {
            header: {SalesOrderNo, ARDivisionNo, CustomerNo, CustomerPONo, ShipExpireDate, OrderStatus, BillToName},
            detail: lines,
        }
    },
    {
        condition: (_, {getState}) => {
            const loading = selectSalesOrderLoading(getState() as RootState);
            return !loading;
        },
    }
)


export const setExtraStickers = createAction<number>('salesOrder/setExtraStickers');

export const generateStickers2 = createAsyncThunk
export const generateStickers = createAsyncThunk<number, boolean>(
    'salesOrder/generate',
    async (reversed, {getState}) => {
        const state = getState() as RootState;
        const currentCustomer = selectCustomerSettings(state);
        const salesOrder = selectSalesOrder(state);
        const shipTo = selectShipTo(state);
        const lines: BarcodeSOLineItem[] = selectSalesOrderDetailItems(state)
            .filter(row => row.selected && !!row.stickerQty && !!row.item)
            .filter(row => !shipTo || row.UDF_SHIP_CODE === shipTo)
            .map(row => {
                const {LineKey, item, stickerQty} = row;
                return {LineKey, item_id: item?.ID ?? 0, quantity: stickerQty ?? 0};
            });
        const params: GenerateStickerProps = {
            customerId: currentCustomer?.id ?? 0,
            SalesOrderNo: salesOrder?.SalesOrderNo ?? '',
            CustomerPONo: salesOrder?.CustomerPONo ?? '',
            lines,
            reversed: reversed,
        }
        return await postOrderStickers(params);
    }, {
        condition(_, {getState}) {
            const state = getState() as RootState;
            if (!selectCustomerSettings(state)) {
                return false;
            }
            if (!selectSalesOrder(state)) {
                return;
            }
            return state.salesOrder.loading === 'fulfilled';
        }
    }
)

export const setLineQty = createAction<{ lineKey: string; qty: number }>('salesOrder/setLineQty');

export const setShipTo = createAction<string>('salesOrder/setShipTo');

export const toggleLineSelected = createAction<{ lineKey: string; forced?: boolean }>('salesOrder/toggleLineSelected');
export const toggleAllSelected = createAction<boolean>('salesOrder/toggleAllSelected');

export const setLineSort = createAction<SortProps<BarcodeSODetailRecord>>('salesOrder/setSort');

export const dismissQtyGenerated = createAction('salesOrder/dismissQtyGenerated');
