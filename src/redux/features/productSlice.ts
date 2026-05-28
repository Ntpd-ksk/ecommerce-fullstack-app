// โค้ดนี้เป็นส่วนของการจัดการสถานะของผลิตภัณฑ์ใน Redux โดยใช้ Redux Toolkit ซึ่งมี reducer สำหรับการตั้งค่าสถานะของผลิตภัณฑ์

import { IProduct } from "@/app/admin/dashboard/page";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IProduct = {
    id: "",
    imagePath: "",
    name: "",
    brand: "",
    sku: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    warranty: "",
    stock: 0,
    tags: [],
    specs: {},
}

export const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {
        setProduct: (state, action: PayloadAction<IProduct>) => {
            return action.payload
        }
    }
})

export const {setProduct} = productSlice.actions
export default productSlice.reducer