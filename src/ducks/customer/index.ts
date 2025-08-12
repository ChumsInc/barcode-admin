import type {BarcodeCustomerSettings, BarcodeItem} from "chums-types";
import type {BarcodeItemList, SortProps} from "../../types";
import {createReducer} from "@reduxjs/toolkit";
import {
    assignNextUPC,
    loadCustomer,
    removeCustomerItem,
    saveCustomer,
    saveCustomerItem,
    setCurrentItem,
    setItemFilter, setItemShowInactive,
    setItemSort,
    setPage,
    setRowsPerPage
} from "./actions";
import {getPreference, localStorageKeys, setPreference} from "@/api/preferences";

export interface CustomerState {
    settings: BarcodeCustomerSettings | null;
    items: BarcodeItemList;
    selectedItem: BarcodeItem | null,
    loading: boolean;
    saving: boolean;
    itemAction: 'idle'|'loading'|'saving'|'deleting';
    loaded: boolean;
    sort: SortProps<BarcodeItem>,
    filter: string;
    showInactive: boolean;
    page: number;
    rowsPerPage: number;
    customUPCAction: 'idle'|'pending';
}

export const initialCustomerState: CustomerState = {
    settings: null,
    items: {},
    selectedItem: null,
    loading: false,
    saving: false,
    itemAction: 'idle',
    loaded: false,
    sort: {field: 'ItemCode', ascending: true},
    filter: '',
    showInactive: getPreference(localStorageKeys.showInactive, true),
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.itemRowsPerPage, 25),
    customUPCAction: 'idle',
}

const customerReducer = createReducer(initialCustomerState, (builder) => {
    builder
        .addCase(loadCustomer.pending, (state, action) => {
            state.loading = true;
            if (action.meta.arg !== state.settings?.id) {
                state.settings = null;
                state.items = {};
                state.selectedItem = null;
                state.filter = '';
                state.loaded = false;
            }
        })
        .addCase(loadCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.settings = action.payload?.settings ?? null;
            state.items = action.payload?.items ?? {};
            if (action.payload?.items) {
                const [item] = Object.values(action.payload.items).filter(item => item.ID === state.selectedItem?.ID);
                state.selectedItem = item ?? null;
            }
        })
        .addCase(loadCustomer.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveCustomer.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveCustomer.fulfilled, (state, action) => {
            state.saving = false;
            state.settings = action.payload;
        })
        .addCase(saveCustomer.rejected, (state) => {
            state.saving = false;
        })
        .addCase(setCurrentItem, (state, action) => {
            state.selectedItem = action.payload;
        })
        .addCase(saveCustomerItem.pending, (state, action) => {
            state.itemAction = 'saving';
            state.selectedItem = action.meta.arg;
        })
        .addCase(saveCustomerItem.fulfilled, (state, action) => {
            state.itemAction = 'idle';
            state.items = action.payload;
            if (state.selectedItem?.ID === 0) {
                const [item] = Object.values(action.payload).filter(item => item.ItemCode === state.selectedItem?.ItemCode);
                state.selectedItem = item ?? null;
            } else if (!!state.selectedItem?.ID) {
                const [item] = Object.values(action.payload).filter(item => item.ID === state.selectedItem?.ID);
                state.selectedItem = item ?? null;
            }
        })
        .addCase(saveCustomerItem.rejected, (state) => {
            state.itemAction = 'idle';
        })
        .addCase(removeCustomerItem.pending, (state) => {
            state.itemAction = 'deleting';
        })
        .addCase(removeCustomerItem.fulfilled, (state, action) => {
            state.itemAction = 'idle';
            state.selectedItem = null;
            state.items = action.payload;
        })
        .addCase(removeCustomerItem.rejected, (state) => {
            state.itemAction = 'idle';
        })
        .addCase(setItemSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.page = 0;
            state.rowsPerPage = action.payload;
            setPreference(localStorageKeys.itemRowsPerPage, action.payload);
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setItemFilter, (state, action) => {
            state.filter = action.payload;
            state.page = 0;
        })
        .addCase(setItemShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
            state.page = 0;
            setPreference(localStorageKeys.showInactive, state.showInactive);
        })
        .addCase(assignNextUPC.pending, (state) => {
            state.customUPCAction = 'pending';
        })
        .addCase(assignNextUPC.fulfilled, (state) => {
            state.customUPCAction = 'idle'
        })
        .addCase(assignNextUPC.rejected, (state) => {
            state.customUPCAction = 'idle';
        })
})

export default customerReducer;
