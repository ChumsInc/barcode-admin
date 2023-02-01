import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {BarcodeCustomerSettings, BarcodeItem} from "chums-types";
import {
    deleteCustomerItem,
    fetchCustomer,
    postCustomerItem,
    postCustomerSettings,
    postGenNextUPC
} from "../../api/customer";
import {BarcodeCustomerResponse, BarcodeItemList, ColorUPCRecord, SortProps} from "../../types";
import {
    selectCurrentCustomer,
    selectCustomerLoading,
    selectCustomerSaving,
    selectCustomUPCLoading,
    selectItemAction
} from "./selectors";
import {RootState} from "../../app/configureStore";
import {selectCustomersLoading} from "../customers/selectors";
import {formatGTIN} from '@chumsinc/gtin-tools';
import {customerKey} from "../../utils/customer";


export const setCurrentItem = createAction<BarcodeItem | null>('customer/item/select');
export const setRowsPerPage = createAction<number>('customer/item/rowsPerPage');
export const setPage = createAction<number>('customer/item/page');
export const setItemSort = createAction<SortProps<BarcodeItem>>('customer/item/sort');

export const setItemFilter = createAction<string>('customer/item/filter');
export const setItemShowInactive = createAction<boolean | undefined>('customer/item/showInactive');

export const loadCustomer = createAsyncThunk<BarcodeCustomerResponse | null, number | string | null>(
    'customer/load',
    async (customerId, {getState, dispatch}) => {
        const state = getState();
        return await fetchCustomer(customerId);
    },
    {
        condition(arg, {getState}) {
            const state = getState() as RootState;
            return !(selectCustomerLoading(state) || selectCustomerSaving(state));
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
            return !(selectCustomerLoading(state)
                || selectCustomersLoading(state)
                || selectCustomerSaving(state)
            );
        }
    }
)

export const saveCustomerItem = createAsyncThunk<BarcodeItemList, BarcodeItem>(
    'customer/item/save',
    async (arg) => {
        return await postCustomerItem({...arg, UPC: formatGTIN(arg.UPC, true)})
    },
    {
        condition(arg, {getState}) {
            const state = getState() as RootState;
            return selectItemAction(state) === 'idle';
        }
    }
)

export const assignNextUPC = createAsyncThunk<void, BarcodeItem>(
    'customer/item/generateCustomUPC',
    async (arg, {getState, dispatch}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state);
        const notes = `Custom UPC for ${customerKey(customer!)} (BarcodeAdmin)`;
        const colorUPC = await postGenNextUPC(arg, notes);
        dispatch(saveCustomerItem({...arg, UPC: colorUPC?.upc ?? ''}))
    },
    {
        condition(arg, {getState}) {
            const state = getState() as RootState;
            return !!arg.ItemCode && !!arg.ID && !!selectCurrentCustomer(state) && !selectCustomUPCLoading(state);
        }
    }
)

export const removeCustomerItem = createAsyncThunk<BarcodeItemList, BarcodeItem>(
    'customer/item/delete',
    async (arg) => {
        return await deleteCustomerItem(arg);
    },
    {
        condition(arg, {getState}) {
            const state = getState() as RootState;
            return selectItemAction(state) === 'idle';
        }
    }
)
