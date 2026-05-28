import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
};

export const authModalSlice = createSlice({
    name: "authModal",
    initialState,
    reducers: {
        openAuthModal: (state) => {
            state.isOpen = true;
        },
        closeAuthModal: (state) => {
            state.isOpen = false;
        },
    },
});

export const { openAuthModal, closeAuthModal } = authModalSlice.actions;
export default authModalSlice.reducer;
