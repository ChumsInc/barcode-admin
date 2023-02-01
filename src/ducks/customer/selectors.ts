import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {itemFilter, itemSorter} from "./utils";

export const selectCurrentCustomer = (state: RootState) => state.customer.settings;
export const selectCustomerItems = (state: RootState) => state.customer.items;

export const selectCustomerItemsCount = (state: RootState) => Object.keys(state.customer.items).length;
export const selectCustomerItem = (state: RootState) => state.customer.selectedItem;
export const selectItemAction = (state: RootState) => state.customer.itemAction;
export const selectCustomerLoading = (state: RootState) => state.customer.loading;
export const selectCustomerSaving = (state: RootState) => state.customer.saving;
export const selectCustomerLoaded = (state: RootState) => state.customer.loaded;
export const selectItemsSort = (state: RootState) => state.customer.sort;
export const selectItemsFilter = (state: RootState) => state.customer.filter;
export const selectItemsShowInactive = (state: RootState) => state.customer.showInactive;
export const selectItemsPage = (state: RootState) => state.customer.page;
export const selectItemsRowsPerPage = (state: RootState) => state.customer.rowsPerPage;

export const selectCustomUPCLoading = (state:RootState) => state.customer.customUPCAction !== 'idle';

export const selectFilteredItems = createSelector(
    [selectCustomerItems, selectItemsFilter, selectItemsShowInactive, selectItemsSort],
    (items, filter, showInactive, sort) => {
        return Object.values(items)
            .sort(itemSorter(sort))
            .filter(item => showInactive || !(item.InactiveItem === 'Y' || item.ProductType === 'D'))
            .filter(itemFilter(filter));
    }
)
