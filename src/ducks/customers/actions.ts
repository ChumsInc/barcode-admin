import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchCustomers} from "@/api/customer";
import type {BarcodeCustomer} from "chums-types";
import type {RootState} from "@/app/configureStore";
import {selectCustomersStatus} from "@/ducks/customers/index.ts";

export const loadCustomers = createAsyncThunk<BarcodeCustomer[], void, { state: RootState }>(
    'customers/load',
    async () => {
        return await fetchCustomers();
    },
    {
        condition(_, {getState}) {
            const state = getState();
            return selectCustomersStatus(state) === 'idle';
        }
    }
)
