// โค้ดนี้เป็นส่วนหนึ่งของการใช้ Hook ใน Redux Toolkit เพื่อให้ง่ายต่อการใช้งาน Redux ในแอปพลิเคชัน React

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "./store"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector