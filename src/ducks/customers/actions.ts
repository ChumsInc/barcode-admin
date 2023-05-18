import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {BarcodeCustomerList} from "../../types";
import {fetchCustomers} from "../../api/customer";
import {BarcodeCustomer} from "chums-types";
import {RootState} from "../../app/configureStore";
import {selectCustomerLoading} from "../customer/selectors";
import {selectCustomerList, selectCustomersLoading} from "./selectors";

export const loadCustomers = createAsyncThunk<BarcodeCustomerList>(
    'customers/load',
    async () => {
        return await fetchCustomers();
    },
    {
        condition(arg, {getState}) {
            const state = getState() as RootState;
            if (!selectCustomersLoading(state) && Object.values(selectCustomerList(state)).length === 0) {
                return true;
            }
            return !selectCustomerLoading(state) && !selectCustomersLoading(state);
        }
    }
)


export const setCustomersSort = createAction<keyof BarcodeCustomer>('customers/sort');
export const setCustomersFilter = createAction<string>('customers/filter');

export const setRowsPerPage = createAction<number>('customers/customerRowsPerPage');
export const setPage = createAction<number>('customers/setPage');

export const toggleShowInactive = createAction<boolean|undefined>('customers/showInactive');
