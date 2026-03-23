// โค้ดนี้เป็น Component ที่ชื่อ Login ซึ่งใช้ในการแสดงหน้าจอเข้าสู่ระบบของแอปพลิเคชัน โดยใช้ NextAuth เพื่อทำการเข้าสู่ระบบผ่านบัญชี Google

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div className="bg-black min-h-screen grid place-items-center">
        <button className="bg-white px-8 py-4 flex gap-2 items-center"
        onClick={() => signIn("google")}>
            <FcGoogle size={30} /> เข้าสู่ระบบด้วย Google
        </button>
    </div>
  )
}

export default Login
