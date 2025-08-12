import type {RootState} from "@/app/configureStore";

export const selectCustomerList = (state: RootState) => state.customers.list;
export const selectCustomersLoading = (state: RootState) => state.customers.loading;
export const selectCustomersLoaded = (state: RootState) => state.customers.loaded;
export const selectCustomerListSort = (state: RootState) => state.customers.sort;
export const selectCustomerListFilter = (state: RootState) => state.customers.filter;
export const selectCustomerRowsPerPage = (state: RootState) => state.customers.rowsPerPage;
export const selectCustomersPage = (state: RootState) => state.customers.page;
export const selectShowInactiveCustomers = (state:RootState) => state.customers.showInactive;
