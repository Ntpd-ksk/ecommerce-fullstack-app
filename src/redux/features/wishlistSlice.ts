import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

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
    images: { url: string }[]
}

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
    try {
        const res = await axios.get("/api/wishlist")
        return res.data.products as IProduct[]
    } catch (error) {
        return []
    }
})

export const toggleWishlistDb = createAsyncThunk("wishlist/toggle", async (product: IProduct) => {
    try {
        await axios.post("/api/wishlist", { productId: product.id })
        return product
    } catch (error) {
        throw error
    }
})

const initialState: Array<IProduct> = []

export const wishlistSlice = createSlice({
    name: "wishlistSlice",
    initialState,
    reducers: {
        setWishlist: (state, action: PayloadAction<IProduct[]>) => {
            return action.payload
        },
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
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWishlist.fulfilled, (state, action) => {
            return action.payload
        })
        builder.addCase(toggleWishlistDb.pending, (state, action) => {
            // Optimistic update
            const product = action.meta.arg
            const index = state.findIndex((item) => item.id === product.id)
            if (index === -1) {
                state.push(product)
            } else {
                return state.filter((item) => item.id !== product.id)
            }
        })
    }
})

export const { toggleWishlist, removeFromWishlist, setWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
