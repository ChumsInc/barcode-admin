import {BarcodeCustomerList, SortProps} from "../../types";
import {BarcodeCustomer} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {loadCustomers, setCustomersFilter, setCustomersSort, setPage, setRowsPerPage} from "./actions";
import {loadCustomer, saveCustomer} from "../customer/actions";
import {customerKey} from "../../utils/customer";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";

export interface CustomersState {
    list: BarcodeCustomerList;
    loading: boolean;
    loaded: boolean;
    sort: SortProps<BarcodeCustomer>;
    filter: string;
    rowsPerPage: number;
    page: number;
}

const initialCustomerState:CustomersState = {
    list: {},
    loading: false,
    loaded: false,
    sort: {field: "CustomerNo", ascending: true},
    filter: '',
    rowsPerPage: getPreference(localStorageKeys.customerRowsPerPage, 25),
    page: 0,
}

const customersReducer = createReducer(
    initialCustomerState,
    (builder) => {
        builder
            .addCase(loadCustomers.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                state.loaded = true;
            })
            .addCase(loadCustomers.rejected, (state) => {
                state.loading = false;
            })
            .addCase(setCustomersSort, (state, action) => {
                if (action.payload !== state.sort.field) {
                    state.sort = {field: action.payload, ascending: true};
                } else {
                    state.sort.ascending = !state.sort.ascending;
                }
            })
            .addCase(loadCustomer.fulfilled, (state, action) => {
                const [customer] = Object.values(state.list).filter(customer => customer.id === action.payload?.settings?.id);
                if (customer) {
                    delete state.list[customerKey(customer)];
                }
                if (action.payload?.settings) {
                    state.list[customerKey(action.payload.settings)] = action.payload.settings;
                }
            })
            .addCase(saveCustomer.fulfilled, (state, action) => {
                const [customer] = Object.values(state.list).filter(customer => customer.id === action.payload?.id);
                if (customer) {
                    delete state.list[customerKey(customer)];
                }
                if (action.payload) {
                    state.list[customerKey(action.payload)] = action.payload;
                }
            })
            .addCase(setRowsPerPage, (state, action) => {
                setPreference(localStorageKeys.customerRowsPerPage, action.payload ?? 25);
                state.rowsPerPage = action.payload;
            })
            .addCase(setPage, (state, action) => {
                state.page = action.payload;
            })
            .addCase(setCustomersFilter, (state, action) => {
                state.filter = action.payload;
                state.page = 0;
            });
    }
)

export default customersReducer;
