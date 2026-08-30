import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IProductItem {
  id: string;
  images: { url: string }[];
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock?: number;
  category?: string;
}

interface ProductsListState {
  items: IProductItem[];
  isLoaded: boolean;
}

const initialState: ProductsListState = {
  items: [],
  isLoaded: false,
};

export const productsListSlice = createSlice({
  name: "productsList",
  initialState,
  reducers: {
    setProductsList: (state, action: PayloadAction<IProductItem[]>) => {
      state.items = action.payload;
      state.isLoaded = true;
    },
  },
});

export const { setProductsList } = productsListSlice.actions;
export default productsListSlice.reducer;
