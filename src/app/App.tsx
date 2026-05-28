// โค้ดนี้เป็น Component ที่เรียกว่า "App" ซึ่งเป็น Component หลักของแอปพลิเคชัน React โดยใช้ Redux เพื่อจัดการสถานะแอปพลิเคชัน

// ระบุว่าโค้ดนี้เป็นส่วนของ client-side code ซึ่งจะถูก execute ในเบราว์เซอร์
"use client"
// นำเข้า object store เพื่อใช้เป็น store ในการจัดการสถานะของแอปพลิเคชัน
import {store} from "@/redux/store"
// นำเข้า React เพื่อใช้ในการสร้าง Component
import React from 'react'
// นำเข้า Provider component เพื่อใช้ในการทำให้ store เป็น Global สำหรับ Component ทั้งหมดในแอปพลิเคชัน
import { Provider } from "react-redux"
import { useSession } from "next-auth/react"
import { useAppDispatch } from "@/redux/hook"
import { fetchWishlist } from "@/redux/features/wishlistSlice"

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    if (session) {
      dispatch(fetchWishlist())
    }
  }, [session, dispatch])

  return <>{children}</>
}

const App = ({children}: {children: React.ReactNode}) => {
  return (
    <Provider store={store}>
      <AppWrapper>
        {children}
      </AppWrapper>
    </Provider>
  )
}

export default App