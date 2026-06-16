import type {BarcodeCustomer, SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadCustomers} from "./actions";
import {loadCustomer, saveCustomer} from "../customer/actions";
import {customerKey} from "@/utils/customer";
import {customerFilter, customerSort} from "@/ducks/customers/utils.ts";

export interface CustomersState {
    status: 'idle' | 'loading' | 'rejected',
    sort: SortProps<BarcodeCustomer>;
    filter: string;
    showInactive: boolean;
}

const initialCustomerState: CustomersState = {
    status: 'idle',
    sort: {field: "CustomerNo", ascending: true},
    filter: '',
    showInactive: false,
}

const adapter = createEntityAdapter<BarcodeCustomer, string>({
    selectId: (arg) => customerKey(arg),
    sortComparer: (a, b) => customerKey(a).localeCompare(customerKey(b)),
})

const selectors = adapter.getSelectors();

const customersSlice = createSlice({
    name: 'customers',
    initialState: adapter.getInitialState(initialCustomerState),
    reducers: {
        setCustomerSort: (state, action: PayloadAction<SortProps<BarcodeCustomer>>) => {
            state.sort = action.payload;
        },
        setCustomersFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
        showInactiveCustomers: (state, action: PayloadAction<boolean>) => {
            state.showInactive = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCustomer.fulfilled, (state, action) => {
                if (action.payload?.settings) {
                    adapter.setOne(state, action.payload.settings)
                }
            })
            .addCase(saveCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setOne(state, action.payload);
                }
            })
            .addAsyncThunk(loadCustomers, {
                pending: (state) => {
                    state.status = 'loading';
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    adapter.setAll(state, action.payload)
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })

    },
    selectors: {
        selectCustomers: (state) => selectors.selectAll(state),
        selectCustomersStatus: (state) => state.status,
        selectCustomersSort: (state) => state.sort,
        selectCustomersFilter: (state) => state.filter,
        selectShowInactiveCustomers: (state) => state.showInactive,
    }
});

export default customersSlice;

export const {setCustomerSort, setCustomersFilter, showInactiveCustomers} = customersSlice.actions;
export const {
    selectCustomers,
    selectCustomersFilter,
    selectCustomersSort,
    selectCustomersStatus,
    selectShowInactiveCustomers,
} = customersSlice.selectors;

export const selectSortedCustomers = createSelector(
    [selectCustomers, selectShowInactiveCustomers, selectCustomersFilter, selectCustomersSort],
    (list, showInactive, filter, sort) => {
        return list
            .filter(row => showInactive || row.active)
            .filter(customerFilter(filter))
            .sort(customerSort(sort));
    }
)
