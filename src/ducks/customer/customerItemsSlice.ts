import type {BarcodeItem, SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {dismissAlert} from "@chumsinc/alert-list";
import {
    assignNextUPC,
    loadCustomer,
    removeCustomerItem,
    saveCustomer,
    saveCustomerItem
} from "@/ducks/customer/actions.ts";
import {itemFilter, itemSorter} from "@/ducks/customer/utils.ts";

export interface CustomerItemsState {
    customerId: number | null;
    status: 'idle' | 'loading' | 'saving' | 'deleting' | 'rejected';
    sort: SortProps<BarcodeItem>;
    filter: string;
    showInactive: boolean;
}

const initialState: CustomerItemsState = {
    customerId: null,
    status: "idle",
    sort: {field: 'ItemCode', ascending: true},
    filter: '',
    showInactive: false,
}

const adapter = createEntityAdapter<BarcodeItem, number>({
    selectId: (arg) => arg.ID,
    sortComparer: (a, b) => a.ID - b.ID,
});
const selectors = adapter.getSelectors();

const customerItemsSlice = createSlice({
    name: 'customerItems',
    initialState: adapter.getInitialState(initialState),
    reducers: {
        setCustomerItemsSort: (state, action: PayloadAction<SortProps<BarcodeItem>>) => {
            state.sort = action.payload;
        },
        setCustomerItemsFilter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
        showInactiveCustomerItems: (state, action: PayloadAction<boolean>) => {
            state.showInactive = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context?.startsWith('customer/item/')) {
                    state.status = 'idle';
                }
            })
            .addCase(saveCustomer.fulfilled, (state, action) => {
                state.customerId = action.payload?.id ?? null;
            })
            .addAsyncThunk(loadCustomer, {
                pending: (state, action) => {
                    state.status = 'loading';
                    if (!action.meta.arg || +action.meta.arg !== state.customerId) {
                        adapter.removeAll(state);
                    }
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    state.customerId = action.payload?.settings?.id ?? null;
                    adapter.setAll(state, action.payload?.items ?? []);
                }
            })
            .addAsyncThunk(saveCustomerItem, {
                pending: (state) => {
                    state.status = 'saving';
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    adapter.setAll(state, action.payload)
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })
            .addAsyncThunk(removeCustomerItem, {
                pending: (state) => {
                    state.status = 'deleting';
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    adapter.setAll(state, action.payload);
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })
            .addAsyncThunk(assignNextUPC, {
                pending: (state) => {
                    state.status = 'saving';
                },
                fulfilled: (state, action) => {
                    state.status = 'idle';
                    adapter.setAll(state, action.payload);
                },
                rejected: (state) => {
                    state.status = 'rejected';
                }
            })
    },
    selectors: {
        selectItems: (state) => selectors.selectAll(state),
        selectItemSort: (state) => state.sort,
        selectItemsCount: (state) => selectors.selectTotal(state),
        selectItemFilter: (state) => state.filter,
        selectShowInactiveItems: (state) => state.showInactive,
        selectItemsStatus: (state) => state.status,
    }
});

export default customerItemsSlice;
export const {setCustomerItemsSort, showInactiveCustomerItems, setCustomerItemsFilter} = customerItemsSlice.actions;
export const {
    selectItems,
    selectItemSort,
    selectItemsStatus,
    selectShowInactiveItems,
    selectItemFilter,
    selectItemsCount
} = customerItemsSlice.selectors;

export const selectFilteredItems = createSelector(
    [selectItems, selectItemFilter, selectShowInactiveItems, selectItemSort],
    (items, filter, showInactive, sort) => {
        return items
            .filter(item => showInactive || !(item.InactiveItem === 'Y' || item.ProductType === 'D'))
            .filter(itemFilter(filter))
            .sort(itemSorter(sort))
    }
)
