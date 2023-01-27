import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {BarcodeCustomer, BarcodeCustomerSettings, BarcodeItem} from "chums-types";
import {deleteCustomerItem, fetchCustomer, postCustomerItem, postCustomerSettings} from "../../api/customer";
import {BarcodeCustomerResponse, BarcodeItemList, SortProps} from "../../types";
import {selectCustomerLoading, selectCustomerSaving, selectItemAction} from "./selectors";
import {RootState} from "../../app/configureStore";
import {selectCustomersLoading} from "../customers/selectors";


export const setCurrentItem = createAction<BarcodeItem|null>('customer/item/select');
export const setRowsPerPage = createAction<number>('customer/item/rowsPerPage');
export const setPage = createAction<number>('customer/item/page');
export const setItemSort = createAction<SortProps<BarcodeItem>>('customer/item/sort');

export const setItemFilter = createAction<string>('customer/item/filter');
export const setItemShowInactive = createAction<boolean|undefined>('customer/item/showInactive');

export const loadCustomer = createAsyncThunk<BarcodeCustomerResponse|null, number|string|null>(
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

export const saveCustomer = createAsyncThunk<BarcodeCustomerSettings|null, BarcodeCustomerSettings>(
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
        return await postCustomerItem(arg)
    },
    {
        condition(arg, {getState}) {
            const state = getState() as RootState;
            return selectItemAction(state) === 'idle';
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
