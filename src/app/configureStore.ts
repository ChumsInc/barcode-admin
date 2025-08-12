import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userReducer from "../ducks/user";
import itemReducer from "../ducks/item";
import customersReducer from "../ducks/customers";
import customerReducer from "../ducks/customer";
import salesOrderReducer from "../ducks/salesOrder";
import versionReducer from "../ducks/version";
import {alertsSlice} from "@chumsinc/alert-list";


const rootReducer = combineReducers({
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    customer: customerReducer,
    customers: customersReducer,
    item: itemReducer,
    salesOrder: salesOrderReducer,
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
