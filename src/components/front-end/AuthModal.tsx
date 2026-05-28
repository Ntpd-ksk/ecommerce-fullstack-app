"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";

interface PropsType {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: PropsType) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  if (!isOpen) return null;

  const validatePassword = (pass: string) => {
    return pass.length >= 8 && /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
  };

  const hasLower = /[a-z]/.test(formData.password);
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasLength = formData.password.length >= 8;
  const isMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const isMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("เข้าสู่ระบบสำเร็จ");
        onClose();
        router.refresh();
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error("รหัสผ่านไม่ตรงกัน");
        setLoading(false);
        return;
      }

      if (!validatePassword(formData.password)) {
        toast.error("รหัสผ่านต้องมีอย่างน้อย 8 ตัว มีพิมพ์เล็กและพิมพ์ใหญ่");
        setLoading(false);
        return;
      }

      try {
        await axios.post("/api/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success("สมัครสมาชิกสำเร็จ");
        setIsLogin(true);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "เกิดข้อผิดพลาด");
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-8 rounded-lg relative shadow-xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-black text-2xl">
          <AiOutlineClose />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="ชื่อ"
              className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="อีเมล"
            className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            className={`w-full border p-2 rounded focus:border-accent outline-none ${
                !isLogin && formData.password && !validatePassword(formData.password) ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {!isLogin && (
            <div>
              <input
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                className={`w-full border p-2 rounded focus:border-accent outline-none ${
                  isMismatch ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              {isMismatch && (
                <p className="text-red-500 text-xs mt-1">รหัสผ่านไม่ตรงกัน</p>
              )}
            </div>
          )}

          {!isLogin && formData.password.length > 0 && (
            <div className="text-xs space-y-1">
              <p className={hasLength ? "text-green-600" : "text-red-500"}>
                {hasLength ? "✓" : "✗"} อย่างน้อย 8 ตัวอักษร
              </p>
              <p className={hasLower ? "text-green-600" : "text-red-500"}>
                {hasLower ? "✓" : "✗"} มีตัวอักษรตัวเล็ก (a-z)
              </p>
              <p className={hasUpper ? "text-green-600" : "text-red-500"}>
                {hasUpper ? "✓" : "✗"} มีตัวอักษรตัวใหญ่ (A-Z)
              </p>
              <p className={hasNumber ? "text-green-600" : "text-red-500"}>
                {hasNumber ? "✓" : "✗"} มีตัวเลข (0-9)
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3 rounded font-bold hover:opacity-90 disabled:bg-gray-400"
          >
            {loading ? "กำลังดำเนินการ..." : isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent font-bold hover:underline"
          >
            {isLogin ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
