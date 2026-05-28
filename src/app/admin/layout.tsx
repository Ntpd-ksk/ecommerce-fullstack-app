// โค้ดนี้เป็น Layout สำหรับหน้า Admin Panel ที่ใช้ในการแสดงหน้าต่างๆ และการจัดการการโหลดข้อมูล

"use client"
// นำเข้าคอมโพเนนต์
import Loader from '@/components/admin-panel/Loader'
import Sidebar from '@/components/admin-panel/Sidebar'
// นำเข้า hook useAppSelector เพื่อใช้ในการเลือกข้อมูลจาก store
import { useAppSelector } from '@/redux/hook'
// นำเข้า hook useSession จาก Next.js สำหรับการจัดการเซสชันของผู้ใช้
import { useSession } from 'next-auth/react'
import React from 'react'

// ประกาศ functional component ชื่อ layout ซึ่งเป็นเลเอาท์หลักสำหรับหน้าแอดมิน รับค่า children เป็น prop
const layout = ({children}: {children: React.ReactNode}) => {

  // ใช้ useAppSelector เพื่อเลือกค่า isLoading จาก store ซึ่งเป็นสถานะของการโหลดข้อมูล
  const isLoading = useAppSelector(store => store.LoadingReducer)
  // ใช้ useSession เพื่อเรียกใช้ข้อมูลเซสชันของผู้ใช้
  const { data: session, status } = useSession()

  // ถ้ากำลังโหลดเซสชัน ให้แสดง Loader
  if (status === 'loading') {
    return <div className="grid place-items-center h-screen"><Loader /></div>
  }

  // หมายเหตุ: Middleware (src/middleware.ts) จะทำหน้าที่ตรวจสอบ session และ role ADMIN ให้อัตโนมัติ
  // หากเข้าหน้านี้ได้ แสดงว่า login แล้วและเป็น ADMIN

  return <div className="flex">
    <Sidebar />
    <div className='w-full h-full'>
        {/* <Navbar /> */}
        <div className='bg-gray-200 p-4 h-[calc(100vh-64px)]'>{children}</div>
    </div>
    {isLoading && <Loader />}
  </div>
}

export default layout