import type {SageItem} from "../../types";
import {createReducer} from "@reduxjs/toolkit";
import {loadItem} from "./actions";
import {setCurrentItem} from "../customer/actions";

export type SageItemMap = {
    [key:string]: SageItem;
}
export interface ItemState {
    list: SageItemMap;
    itemCode: string | null;
    item: SageItem | null;
    loading: boolean;
    loaded: boolean;
}

export const initialItemState: ItemState = {
    list: {},
    itemCode: null,
    item: null,
    loading: false,
    loaded: false,
}


const itemReducer = createReducer(initialItemState, (builder) => {
    builder
        .addCase(setCurrentItem, (state, action) => {
            if (state.itemCode !== action.payload?.ItemCode) {
                state.item = null;
                state.loaded = false;
            }
        })
        .addCase(loadItem.pending, (state, action) => {
            state.loading = true;
            if (action.meta.arg !== state.itemCode) {
                state.item = null;
                state.loaded = false;
            }
        })
        .addCase(loadItem.fulfilled, (state, action) => {
            state.loaded = true;
            state.loading = false;
            state.item = action.payload;
        })
        .addCase(loadItem.rejected, (state) => {
            state.loading = false;
            state.loaded = true;
        })
})

export default itemReducer;
