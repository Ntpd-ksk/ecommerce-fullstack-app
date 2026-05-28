import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface IProduct {
    id: string
    name: string
    brand: string
    sku: string
    description: string
    price: string
    discountPrice: string
    warranty: string
    tags: string | string[]
    specs: any
    imagePath: string
}

const initialState: Array<IProduct> = []

export const wishlistSlice = createSlice({
    name: "wishlistSlice",
    initialState,
    reducers: {
        toggleWishlist: (state, action: PayloadAction<IProduct>) => {
            const index = state.findIndex((item) => item.id === action.payload.id);
            if (index === -1) {
                state.push(action.payload);
            } else {
                return state.filter((item) => item.id !== action.payload.id);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            return state.filter((item) => item.id !== action.payload);
        }
    }
})

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
