// โค้ดนี้เป็น Component ที่ชื่อ Login ซึ่งใช้ในการแสดงหน้าจอเข้าสู่ระบบของแอปพลิเคชัน โดยใช้ NextAuth เพื่อทำการเข้าสู่ระบบผ่านบัญชี Google

import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  return (
    <div className="bg-black min-h-screen grid place-items-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h1>
        <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้าจัดการร้านค้า</p>
        <button
          className="bg-accent text-white px-8 py-3 rounded-md font-bold hover:opacity-90 transition-opacity"
          onClick={() => router.push("/login")}
        >
          ไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  )
}

export default Login
