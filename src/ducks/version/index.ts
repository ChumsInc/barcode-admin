import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchVersion} from "../../api/version";
import {RootState} from "../../app/configureStore";

export interface VersionState {
    version: string|null;
}

export const defaultState: VersionState = {
    version: null
}

export const selectVersion = (state:RootState) => state.version.version;

export const loadVersion = createAsyncThunk(
    'version/load',
    async () => {
        return await fetchVersion();
    }
)

const versionReducer = createReducer(defaultState, (builder) => {
    builder
        .addCase(loadVersion.fulfilled, (state, action) => {
            state.version = action.payload;
        });
})

export default versionReducer;
