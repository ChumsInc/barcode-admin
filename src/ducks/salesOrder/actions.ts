import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchSalesOrder, postOrderStickers} from "../../api/order-stickers";
import {
    BarcodeItemList,
    BarcodeSalesOrder,
    BarcodeSODetailLine,
    BarcodeSOLineItem,
    GenerateStickerProps,
    SalesOrderDetailBarcodeItem
} from "../../types";
import {SortProps} from "chums-components";
import {RootState} from "../../app/configureStore";
import {selectCurrentCustomer, selectCustomerItems} from "../customer/selectors";
import Decimal from "decimal.js";
import {selectExtraQuantity, selectSalesOrder, selectSalesOrderDetailItems, selectSalesOrderLoading} from "./selectors";
import {itemStickerQty} from "./utils";

export function parseSalesOrderLines(items: BarcodeItemList, detail: SalesOrderDetailBarcodeItem[], extra: number): BarcodeSODetailLine[] {
    return detail.map(row => {
        const {
            LineKey,
            ItemCode,
            CommentText,
            ItemType,
            BinLocation,
            UnitOfMeasure,
            UnitOfMeasureConvFactor,
            SequenceNo,
            WarehouseCode,
            QuantityOrdered,
            QuantityShipped,
        } = row;
        const Quantity = new Decimal(QuantityOrdered).sub(QuantityShipped).toString();
        const stickerQty = !!items[ItemCode]
            ? itemStickerQty({ItemType, Quantity, UnitOfMeasureConvFactor}, extra)
            : null;
        return {
            LineKey,
            SequenceNo,
            ItemCode,
            WarehouseCode,
            CommentText,
            ItemType,
            BinLocation: BinLocation ?? '',
            UnitOfMeasure,
            UnitOfMeasureConvFactor,
            QuantityOrdered,
            QuantityShipped,
            Quantity,
            item: items[row.ItemCode],
            selected: false,
            stickerQty,
        }
    })
}

export const loadSalesOrder = createAsyncThunk<BarcodeSalesOrder | null, string>(
    'salesOrder/load',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const items = selectCustomerItems(state);
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
        condition: (arg, {getState}) => {
            const loading = selectSalesOrderLoading(getState() as RootState);
            return !loading;
        },
    }
)


export const setExtraStickers = createAction<number>('salesOrder/setExtraStickers');

export const generateStickers = createAsyncThunk<number, boolean>(
    'salesOrder/generate',
    async (reversed, {getState}) => {
        const state = getState() as RootState;
        const currentCustomer = selectCurrentCustomer(state);
        const salesOrder = selectSalesOrder(state);
        const lines: BarcodeSOLineItem[] = selectSalesOrderDetailItems(state)
            .filter(row => row.selected && !!row.stickerQty && !!row.item)
            .map(row => {
                const {LineKey, item, Quantity, stickerQty} = row;
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
        condition(arg, {getState}) {
            const state = getState() as RootState;
            if (!selectCurrentCustomer(state)) {
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

export const toggleLineSelected = createAction<{ lineKey: string; forced?: boolean }>('salesOrder/toggleLineSelected');
export const toggleAllSelected = createAction<boolean>('salesOrder/toggleAllSelected');

export const setLineSort = createAction<SortProps<BarcodeSODetailLine>>('salesOrder/setSort');

export const dismissQtyGenerated = createAction('salesOrder/dismissQtyGenerated');
