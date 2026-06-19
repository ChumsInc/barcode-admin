import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userReducer from "../ducks/user";
import itemReducer from "../ducks/item";
import customersSlice from "../ducks/customers";
import salesOrderReducer from "../ducks/salesOrder";
import versionReducer from "../ducks/version";
import {alertsSlice} from "@chumsinc/alert-list";
import customerSettingsSlice from "@/ducks/customer/customerSettingsSlice.ts";
import customerItemsSlice from "@/ducks/customer/customerItemsSlice.ts";
import salesOrderSlice from "@/ducks/salesOrder/salesOrderSlice.ts";


const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    [customersSlice.reducerPath]: customersSlice.reducer,
    [customerItemsSlice.reducerPath]: customerItemsSlice.reducer,
    [customerSettingsSlice.reducerPath]: customerSettingsSlice.reducer,
    item: itemReducer,
    salesOrder: salesOrderReducer,
    [salesOrderSlice.reducerPath]: salesOrderSlice.reducer,
    user: userReducer,
    version: versionReducer,
})

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
