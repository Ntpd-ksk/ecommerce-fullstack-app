// โค้ดนี้เป็น Component ที่เรียกว่า "App" ซึ่งเป็น Component หลักของแอปพลิเคชัน React โดยใช้ Redux เพื่อจัดการสถานะแอปพลิเคชัน

// ระบุว่าโค้ดนี้เป็นส่วนของ client-side code ซึ่งจะถูก execute ในเบราว์เซอร์
"use client"
// นำเข้า object store เพื่อใช้เป็น store ในการจัดการสถานะของแอปพลิเคชัน
import {store} from "@/redux/store"
// นำเข้า React เพื่อใช้ในการสร้าง Component
import React from 'react'
// นำเข้า Provider component เพื่อใช้ในการทำให้ store เป็น Global สำหรับ Component ทั้งหมดในแอปพลิเคชัน
import { Provider } from "react-redux"

// ประกาศ Component ที่ชื่อ "App" โดย children คือ Component ที่จะถูก render ภายใต้ Component App
const App = ({children}: {children: React.ReactNode}) => {
  // ใช้ Provider component เพื่อให้ทุก Component ในแอปพลิเคชันสามารถเข้าถึง store
  return <Provider store={store}>{children}</Provider>
}

export default App