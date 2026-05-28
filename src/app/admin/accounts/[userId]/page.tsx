"use client"
import { setLoading } from '@/redux/features/loadingSlice'
import { useAppDispatch } from '@/redux/hook'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'

interface IAddress {
  id: string
  name: string
  phone: string
  address: string
  province: string
  district: string
  subDistrict: string
  postalCode: string
  isDefault: boolean
}

interface IOrder {
  id: string
  total: number
  status: string
  createdAt: string
  items: {
    id: string
    quantity: number
    product: {
      name: string
    }
  }[]
}

interface IUserDetail {
  id: string
  name: string
  email: string
  role: string
  phone: string
  birthDate: string
  facebook: string
  line: string
  addresses: IAddress[]
  orders: IOrder[]
  _count: {
    orders: number
    wishlist: number
  }
}

const UserDetailPage = ({ params }: { params: { userId: string } }) => {
  const [user, setUser] = useState<IUserDetail | null>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(setLoading(true))
    axios
      .get(`/api/admin/users/${params.userId}`)
      .then((res) => setUser(res.data))
      .catch(err => console.log(err))
      .finally(() => dispatch(setLoading(false)))
  }, [params.userId])

  if (!user) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-600"
      case "SHIPPING": return "bg-blue-100 text-blue-600"
      case "SUCCESS": return "bg-emerald-100 text-emerald-600"
      case "CANCELLED": return "bg-red-100 text-red-600"
      case "VERIFYING": return "bg-orange-100 text-orange-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className='bg-white min-h-[calc(100vh-96px)] rounded-lg p-6 overflow-y-auto'>
      <button
        onClick={() => router.back()}
        className='flex items-center gap-2 text-gray-500 hover:text-black mb-4'
      >
        <IoArrowBack /> ย้อนกลับ
      </button>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Profile Card */}
        <div className='md:col-span-1 border rounded-lg p-4 h-fit'>
          <h3 className='text-xl font-bold mb-4 border-b pb-2'>ข้อมูลส่วนตัว</h3>
          <div className='space-y-3 text-sm'>
            <p><span className='font-semibold'>ชื่อ:</span> {user.name || "-"}</p>
            <p><span className='font-semibold'>อีเมล:</span> {user.email}</p>
            <p><span className='font-semibold'>เบอร์โทรศัพท์:</span> {user.phone || "-"}</p>
            <p><span className='font-semibold'>บทบาท:</span> {user.role}</p>
            <p><span className='font-semibold'>วันเกิด:</span> {user.birthDate || "-"}</p>
            <p><span className='font-semibold'>Facebook:</span> {user.facebook || "-"}</p>
            <p><span className='font-semibold'>Line:</span> {user.line || "-"}</p>
            <div className='pt-2 mt-2 border-t flex justify-between'>
              <span>คำสั่งซื้อ: {user._count.orders}</span>
              <span>Wishlist: {user._count.wishlist}</span>
            </div>
          </div>
        </div>

        {/* Addresses & Orders */}
        <div className='md:col-span-2 space-y-6'>
          {/* Addresses */}
          <div className='border rounded-lg p-4'>
            <h3 className='text-xl font-bold mb-4 border-b pb-2'>ที่อยู่จัดส่ง ({user.addresses.length})</h3>
            <div className='space-y-4'>
              {user.addresses.length === 0 ? (
                <p className='text-gray-400 text-center py-4'>ไม่มีข้อมูลที่อยู่</p>
              ) : (
                user.addresses.map(addr => (
                  <div key={addr.id} className={`p-3 rounded border ${addr.isDefault ? 'border-accent bg-accent/5' : ''}`}>
                    <div className='flex justify-between items-start'>
                      <p className='font-semibold'>{addr.name} ({addr.phone})</p>
                      {addr.isDefault && <span className='text-xs bg-accent text-white px-2 py-0.5 rounded'>ค่าเริ่มต้น</span>}
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>
                      {addr.address} {addr.subDistrict} {addr.district} {addr.province} {addr.postalCode}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Orders */}
          <div className='border rounded-lg p-4'>
            <h3 className='text-xl font-bold mb-4 border-b pb-2'>ประวัติคำสั่งซื้อ</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='text-gray-500 border-b'>
                    <th className='p-2'>วันที่</th>
                    <th className='p-2'>รายการ</th>
                    <th className='p-2'>ยอดรวม</th>
                    <th className='p-2'>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {user.orders.length === 0 ? (
                    <tr><td colSpan={4} className='p-4 text-center text-gray-400'>ยังไม่มีคำสั่งซื้อ</td></tr>
                  ) : (
                    user.orders.map(order => (
                      <tr key={order.id} className='border-b last:border-0'>
                        <td className='p-2'>{new Date(order.createdAt).toLocaleDateString('th-TH')}</td>
                        <td className='p-2'>
                          <div className='max-w-[200px] truncate'>
                            {order.items.map(i => i.product.name).join(", ")}
                          </div>
                          <div className='text-xs text-gray-400'>{order.items.length} รายการ</div>
                        </td>
                        <td className='p-2'>฿{Number(order.total).toLocaleString()}</td>
                        <td className='p-2'>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailPage
