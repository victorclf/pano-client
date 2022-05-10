import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface GuiState {
    appBarTitle: string | null;
    appBarShowBackButton: boolean;
}

const initialState = {
    appBarTitle: null,
    appBarShowBackButton: false
} as GuiState;

const guiSlice = createSlice({
    name: 'gui',
    initialState,
    reducers: {
        appBarTitleCustomized(state, action: PayloadAction<string>) {
            state.appBarTitle = action.payload;
        },
        appBarTitleReset(state) {
            state.appBarTitle = null;
        },
        appBarBackButtonEnabled(state) {
            state.appBarShowBackButton = true;
        },
        appBarBackButtonDisabled(state) {
            state.appBarShowBackButton = false;
        }
    },
});

export const {
    appBarTitleCustomized,
    appBarTitleReset,
    appBarBackButtonEnabled,
    appBarBackButtonDisabled } = guiSlice.actions;
export default guiSlice.reducer;

export const selectAppBarTitle = (state: RootState) => state.gui.appBarTitle;
export const selectAppBarShowBackButton = (state: RootState) => state.gui.appBarShowBackButton;
