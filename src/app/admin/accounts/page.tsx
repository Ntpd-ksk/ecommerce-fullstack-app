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
    <div className='bg-white h-[calc(100vh-96px)] rounded-lg p-4'>
      <h2 className='text-3xl'>รายชื่อผู้ใช้ทั้งหมด</h2>

      <div className='mt-4 h-[calc(100vh-180px)] overflow-y-auto'>
        <table className='w-full text-left'>
          <thead>
            <tr className='text-gray-500 border-t border-[#ececec]'>
              <th className="p-2">ลำดับ</th>
              <th className="p-2">ชื่อ</th>
              <th className="p-2">อีเมล</th>
              <th className="p-2">เบอร์โทรศัพท์</th>
              <th className="p-2">บทบาท</th>
              <th className="p-2">จำนวนคำสั่งซื้อ</th>
              <th className="p-2">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-t border-[#ececec]">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{user.name || "-"}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.phone || "-"}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.role === "ADMIN" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-2">{user._count.orders}</td>
                <td className="p-2">
                  <button
                    onClick={() => router.push(`/admin/accounts/${user.id}`)}
                    className="bg-accent text-white px-3 py-1 rounded-md text-sm hover:opacity-90 transition-opacity"
                  >
                    ดู
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AccountsPage
