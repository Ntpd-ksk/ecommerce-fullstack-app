"use client"
import { setLoading } from '@/redux/features/loadingSlice'
import { useAppDispatch } from '@/redux/hook'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface IUser {
  id: string
  name: string
  email: string
  role: string
  phone: string
  _count: {
    orders: number
  }
}

const AccountsPage = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(setLoading(true))
    axios
      .get("/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch(err => console.log(err))
      .finally(() => dispatch(setLoading(false)))
  }, [])

  return (
    <div className='space-y-6'>
      <div className="flex justify-between items-center">
        <div>
          <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>รายชื่อผู้ใช้ทั้งหมด</h2>
          <p className="text-sm text-gray-500 mt-1">จัดการข้อมูลบัญชีผู้ใช้ในระบบ</p>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-[#0a0a0a] text-gray-300 text-[11px] uppercase tracking-widest font-bold'>
              <tr>
                <th className="px-6 py-4">ลำดับ</th>
                <th className="px-6 py-4">ชื่อ</th>
                <th className="px-6 py-4">อีเมล</th>
                <th className="px-6 py-4">เบอร์โทรศัพท์</th>
                <th className="px-6 py-4">บทบาท</th>
                <th className="px-6 py-4">คำสั่งซื้อ</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors even:bg-gray-50/30">
                  <td className="px-6 py-4 text-gray-500 font-medium text-sm">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{user.name || "ไม่ระบุชื่อ"}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.phone || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                      user.role === "ADMIN"
                        ? "bg-[#ef4444]/10 text-[#ef4444]"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{user._count.orders}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => router.push(`/admin/accounts/${user.id}`)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#ef4444] transition-all shadow-sm"
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AccountsPage
