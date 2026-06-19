import type {BarcodeCustomerSettings} from "chums-types";
import {createSlice} from "@reduxjs/toolkit";
import {loadCustomer, saveCustomer} from "@/ducks/customer/actions.ts";
import {dismissAlert} from "@chumsinc/alert-list";

export interface CustomerSettingsState {
    id: number | null;
    settings: BarcodeCustomerSettings | null;
    status: 'idle' | 'loading' | 'saving' | 'rejected' | 'busy';
}

const initialState: CustomerSettingsState = {
    id: null,
    settings: null,
    status: 'idle',
}

const customerSettingsSlice = createSlice({
    name: 'customerSettings',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context?.startsWith('customer/')) {
                    state.status = 'idle';
                }
            })
            .addAsyncThunk(loadCustomer, {
                pending: (state, action) => {
                    state.status = 'loading';
                    if (action.meta.arg && +action.meta.arg !== state.id) {
                        state.settings = null;
                    }
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    state.settings = action.payload?.settings ?? null;
                    state.id = action.payload?.settings?.id ?? null;
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })
            .addAsyncThunk(saveCustomer, {
                pending: (state) => {
                    state.status = 'saving';
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    state.settings = action.payload ?? null;
                    state.id = action.payload?.id ?? null;
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })
    },
    selectors: {
        selectCustomerSettings: (state) => state.settings,
        selectCustomerStatus: (state) => state.status,
        selectCustomerId: (state) => state.settings?.id ?? 0,
    }
});

export default customerSettingsSlice;
export const {selectCustomerSettings, selectCustomerStatus, selectCustomerId} = customerSettingsSlice.selectors;

