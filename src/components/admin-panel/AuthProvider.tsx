// โค้ดนี้เป็น Component ที่ชื่อ AuthProvider ซึ่งใช้ในการให้บริการการเข้าสู่ระบบและการจัดการเซสชันของผู้ใช้

"use client"
import { SessionProvider } from 'next-auth/react'
// นำเข้า ReactNode เพื่อใช้เป็นชนิดข้อมูลของ children props
import { ReactNode } from 'react'

// ประกาศ interface PropsType ที่มี properties เพียงแค่ children ซึ่งมีชนิดข้อมูลเป็น ReactNode
interface PropsType {
    children: ReactNode
}

// ประกาศ Component ชื่อ AuthProvider ซึ่งรับ children เป็น props โดยมีชนิดข้อมูลเป็น ReactNode
const AuthProvider = ({children}: PropsType) => {
  // ใช้ SessionProvider เพื่อให้ทุก Component ภายใต้ AuthProvider สามารถเข้าถึง session ของผู้ใช้ได้
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider