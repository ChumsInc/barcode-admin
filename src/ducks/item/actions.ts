import {createAsyncThunk} from "@reduxjs/toolkit";
import {SageItem} from "../../types";
import {fetchItemInfo} from "../../api/item";

export const loadItem = createAsyncThunk<SageItem|null, string>(
    'item/load',
    async (arg) => {
        return await fetchItemInfo(arg);
    })

