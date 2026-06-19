import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {BarcodeCustomerSettings, BarcodeItem, SortProps} from "chums-types";
import {
    deleteCustomerItem,
    fetchCustomer,
    postCustomerItem,
    postCustomerSettings,
    postGenNextUPC
} from "@/api/customer";
import type {BarcodeCustomerResponse, CustomUPCBarcodeItem} from "../../types";
import type {RootState} from "@/app/configureStore";
import {formatGTIN} from '@chumsinc/gtin-tools';
import {customerKey} from "@/utils/customer";
import {selectCustomerSettings, selectCustomerStatus} from "@/ducks/customer/customerSettingsSlice.ts";
import {selectItemsStatus} from "@/ducks/customer/customerItemsSlice.ts";


export const setCurrentItem = createAction<BarcodeItem | null>('customer/item/select');
export const setRowsPerPage = createAction<number>('customer/item/rowsPerPage');
export const setPage = createAction<number>('customer/item/page');
export const setItemSort = createAction<SortProps<BarcodeItem>>('customer/item/sort');

export const setItemFilter = createAction<string>('customer/item/filter');
export const setItemShowInactive = createAction<boolean | undefined>('customer/item/showInactive');

export const loadCustomer = createAsyncThunk<BarcodeCustomerResponse | null, number | string | null>(
    'customer/load',
    async (customerId) => {
        return await fetchCustomer(customerId);
    },
    {
        condition(_, {getState}) {
            const state = getState() as RootState;
            return selectCustomerStatus(state) === 'idle'
        }
    }
)

export const saveCustomer = createAsyncThunk<BarcodeCustomerSettings | null, BarcodeCustomerSettings>(
    'customer/save',
    async (arg) => {
        return await postCustomerSettings({
            ...arg,
            Notes: arg.Notes.trim(),
            SpecialInstructions: arg.SpecialInstructions.trim()
        });
    },
    {
        condition(arg, {getState}) {
            const state = getState() as RootState;
            return !!customerKey(arg) && selectCustomerStatus(state) === 'idle';
        }
    }
)

export const saveCustomerItem = createAsyncThunk<BarcodeItem[], BarcodeItem>(
    'customer/item/save',
    async (arg) => {
        return await postCustomerItem({...arg, UPC: formatGTIN(arg.UPC, true)})
    },
    {
        condition(_, {getState}) {
            const state = getState() as RootState;
            return selectItemsStatus(state) === 'idle';
        }
    }
)

export const assignNextUPC = createAsyncThunk<BarcodeItem[], CustomUPCBarcodeItem>(
    'customer/item/generateCustomUPC',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerSettings(state);
        const notes = `Custom UPC for ${customerKey(customer!)} (BarcodeAdmin)`;
        const colorUPC = await postGenNextUPC(arg, notes);
        return await postCustomerItem({...arg, UPC: formatGTIN(colorUPC?.upc ?? '', true)})
    },
    {
        condition(arg, {getState}) {
            const state = getState() as RootState;
            return !!arg.ItemCode && !!arg.ID && selectItemsStatus(state) === 'idle';
        }
    }
)

export const removeCustomerItem = createAsyncThunk<BarcodeItem[], BarcodeItem>(
    'customer/item/delete',
    async (arg) => {
        return await deleteCustomerItem(arg);
    },
    {
        condition(_, {getState}) {
            const state = getState() as RootState;
            return selectItemsStatus(state) === 'idle';
        }
    }
)
