import type {BarcodeSalesOrderHeader, BarcodeSODetailLine} from "@/src/types.ts";
import type {SortProps} from "chums-types";
import {createEntityAdapter, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {dismissAlert} from "@chumsinc/alert-list";
import {loadSalesOrder} from "@/ducks/salesOrder/actions.ts";

export interface SalesOrderState {
    salesOrderNo: string | null;
    orderHeader: BarcodeSalesOrderHeader | null;
    shipToCodes: string[];
    shipToCode: string | null;
    status: 'idle' | 'loading' | 'saving' | 'rejected';
    extra: number;
    quantityGenerated: number | null;
    sort: SortProps<BarcodeSODetailLine>
}

const initialState: SalesOrderState = {
    salesOrderNo: null,
    orderHeader: null,
    shipToCodes: [],
    shipToCode: null,
    status: 'idle',
    extra: 0,
    quantityGenerated: null,
    sort: {field: 'BinLocation', ascending: true}
}

const adapter = createEntityAdapter<BarcodeSODetailLine, string>({
    selectId: (arg) => arg.LineKey,
    sortComparer: (a, b) => a.LineKey.localeCompare(b.LineKey),
});
const selectors = adapter.getSelectors();

const salesOrderSlice = createSlice({
    name: 'sales-order',
    initialState: adapter.getInitialState(initialState),
    reducers: {
        setExtraStickers: (state, action: PayloadAction<number>) => {
            state.extra = action.payload;
        },
        setDetailSort: (state, action: PayloadAction<SortProps<BarcodeSODetailLine>>) => {
            state.sort = action.payload;
        },
        setShipToCode: (state, action: PayloadAction<string | null>) => {
            state.shipToCode = action.payload;
        },
        clearSalesOrder: (state) => {
            state.salesOrderNo = null;
            state.orderHeader = null;
            state.shipToCodes = [];
            state.shipToCode = null;
            adapter.removeAll(state);
        },
        updateLineQty: (state, action: PayloadAction<Pick<BarcodeSODetailLine, 'LineKey' | 'Quantity'>>) => {
            adapter.updateOne(state, {id: action.payload.LineKey, changes: {Quantity: action.payload.Quantity}});
        },
        toggleLineSelected: (state, action: PayloadAction<Pick<BarcodeSODetailLine, 'LineKey' | 'selected'>>) => {
            adapter.updateOne(state, {id: action.payload.LineKey, changes: {selected: action.payload.selected}});
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context?.startsWith('salesOrder/')) {
                    state.status = 'idle';
                }
            })
            .addAsyncThunk(loadSalesOrder, {
                pending: (state, action) => {
                    state.status = 'loading';
                    if (action.meta.arg !== state.salesOrderNo) {
                        adapter.removeAll(state);
                        state.shipToCodes = [];
                        state.shipToCode = null;
                    }
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    adapter.setAll(state, action.payload?.detail ?? []);
                    state.shipToCodes = action.payload?.detail?.reduce((pv, cv) => {
                        if (!!cv.UDF_SHIP_CODE && !pv.includes(cv.UDF_SHIP_CODE)) {
                            return [...pv, cv.UDF_SHIP_CODE].sort();
                        }
                        return pv;
                    }, [] as string[]) ?? []
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })
    },
    selectors: {
        selectOrderHeader: (state) => state.orderHeader,
        selectOrderDetail: (state) => selectors.selectAll(state),
        selectShipToCode: (state) => state.shipToCode,
        selectShipToCodes: (state) => state.shipToCodes,
        selectDetailSort: (state) => state.sort,
    }
});

export default salesOrderSlice;
export const {setExtraStickers, setDetailSort, setShipToCode, clearSalesOrder} = salesOrderSlice.actions;
export const {
    selectOrderHeader,
    selectOrderDetail,
    selectShipToCode,
    selectShipToCodes,
    selectDetailSort
} = salesOrderSlice.selectors;
