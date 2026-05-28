// โค้ดนี้เป็นส่วนหนึ่งของการกำหนด store ใน Redux Toolkit

import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./features/cartSlice"
import LoadingReducer from "./features/loadingSlice"
import productReducer from "./features/productSlice"
import wishlistReducer from "./features/wishlistSlice"
import authModalReducer from "./features/authModalSlice"
export const store = configureStore({
    reducer: {
        cartReducer,
        productReducer,
        LoadingReducer,
        wishlistReducer,
        authModalReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
