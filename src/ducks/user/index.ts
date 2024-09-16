import {UserRecord} from "chums-types";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {UserValidationResponse} from "../../types";
import {fetchUserValidation} from "../../api/user";
import {RootState} from "../../app/configureStore";

export interface UserState {
    valid: boolean;
    user: UserRecord | null;
    roles: string[];
    loading: boolean;
    loaded: string | null;
    error: string | null;
}

export const initialUserState: UserState = {
    valid: false,
    user: null,
    roles: [],
    loading: false,
    loaded: null,
    error: null,
}

export const selectProfileValid = (state:RootState) => state.user.valid;
export const selectProfileLoading = (state:RootState) => state.user.loading;
export const selectProfileError = (state:RootState) => state.user.error;
export const selectRoles = (state:RootState) => state.user.roles;
export const selectCanEdit = (state:RootState) => state.user.roles.includes('barcode_edit') || state.user.roles.includes('root');
export const selectCanAssignNewUPC = (state:RootState) => state.user.roles.includes('product-admin') || state.user.roles.includes('root');

export const loadUserValidation = createAsyncThunk<UserValidationResponse|null>(
    'user/validate',
    async () => {
        const res = await fetchUserValidation();
        if (res) {
            res.loaded = new Date().toISOString();
        }
        return res;
    },
    {
        condition(arg, {getState}) {
            return !selectProfileLoading(getState() as RootState);
        }
    }
)

const userReducer = createReducer(initialUserState, (builder) => {
    builder
        .addCase(loadUserValidation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loadUserValidation.fulfilled, (state, action) => {
            state.loading = false;
            state.valid = action.payload?.valid ?? false;
            state.user = action.payload?.profile?.user ?? null;
            state.roles = action.payload?.profile?.roles ?? [];
            state.loaded = action.payload?.loaded ?? null;
            state.error = null;
        })
        .addCase(loadUserValidation.rejected, (state, action) => {
            state.loading = false;
            state.valid = false;
            state.user = null;
            state.roles = [];
            state.error = action.error.message ?? null;
        })
});

export default userReducer;
