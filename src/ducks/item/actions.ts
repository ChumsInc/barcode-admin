import {createAsyncThunk} from "@reduxjs/toolkit";
import type {SageItem} from "../../types";
import {fetchItemInfo} from "../../api/item";

export const loadItem = createAsyncThunk<SageItem|null, string>(
    'item/load',
    async (arg) => {
        return await fetchItemInfo(arg);
    })

