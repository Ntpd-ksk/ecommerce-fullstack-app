// โค้ดนี้เป็นการกำหนดการตั้งค่า NextAuth สำหรับการใช้งานระบบการตรวจสอบและการจัดการเซสชันของผู้ใช้ใน Next.js โดยใช้ Google OAuth2 เป็นตัวยืนยันตัวตน

// นำเข้า NextAuth เพื่อใช้ในการกำหนดการตั้งค่าระบบการตรวจสอบและการจัดการเซสชันของผู้ใช้
import NextAuth from "next-auth/next";
// นำเข้า GoogleProvider ในการตรวจสอบตัวตนผ่าน Google OAuth2
import GoogleProvider from "next-auth/providers/google"

// ประกาศตัวแปร handler ซึ่งมีค่าเท่ากับการเรียกใช้ NextAuth โดยกำหนดค่าต่างๆ
const handler = NextAuth({
    // เป็นอาร์เรย์ของ providers ที่ใช้ในการตรวจสอบตัวตนของผู้ใช้
    providers: [
        // กำหนด clientId และ clientSecret โดยใช้ค่าที่กำหนดไว้ในไฟล์ .env
        GoogleProvider({
            clientId: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!
        })
    ],
    // เป็นค่า secret ที่ใช้ในการเข้ารหัสข้อมูลเซสชัน
    secret: process.env.NEXTAUTH_SECRET
})

// ส่งออก handler เพื่อให้สามารถนำไปใช้งานในตัวแปร GET และ POST โดยตรง
export {handler as GET, handler as POST}