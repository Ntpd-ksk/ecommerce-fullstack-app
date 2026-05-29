"use client"
import { setLoading } from '@/redux/features/loadingSlice'
import { useAppDispatch } from '@/redux/hook'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface IOrderStat {
  status: string
  _count: { status: number }
}

interface IAnalytics {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  pendingSlips: number
  orderStats: IOrderStat[]
}

import { MdPeople, MdOutlineReceiptLong, MdAttachMoney, MdShoppingCart } from "react-icons/md"

const DashboardAnalytics = () => {
  const [data, setData] = useState<IAnalytics | null>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    axios
      .get("/api/admin/analytics")
      .then((res) => setData(res.data))
      .catch(err => console.log(err))
      .finally(() => dispatch(setLoading(false)))
  }, [])

  const statusColor: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-600",
    VERIFYING: "bg-orange-50 text-orange-600 border border-orange-100",
    PAID: "bg-blue-50 text-blue-600 border border-blue-100",
    SHIPPING: "bg-purple-50 text-purple-600 border border-purple-100",
    SUCCESS: "bg-green-50 text-green-600 border border-green-100",
    CANCELLED: "bg-red-50 text-red-600 border border-red-100",
  }

  const statusLabel: Record<string, string> = {
    PENDING: "รอชำระเงิน",
    VERIFYING: "กำลังตรวจสอบ",
    PAID: "ชำระแล้ว",
    SHIPPING: "กำลังจัดส่ง",
    SUCCESS: "สำเร็จ",
    CANCELLED: "ยกเลิก",
  }

  if (!data) return null

  return (
    <div className='space-y-8'>
      <div className="flex justify-between items-center">
        <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>ภาพรวมและสถิติ</h2>
        <p className="text-gray-500 text-sm">ข้อมูลอัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <div className="text-gray-500 text-sm font-medium">สมาชิกทั้งหมด</div>
            <div className="text-3xl font-bold mt-1 text-gray-900">{data.totalUsers.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 bg-red-50 text-[#ef4444] rounded-xl flex items-center justify-center text-2xl">
            <MdPeople />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <div className="text-gray-500 text-sm font-medium">คำสั่งซื้อทั้งหมด</div>
            <div className="text-3xl font-bold mt-1 text-gray-900">{data.totalOrders.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 bg-red-50 text-[#ef4444] rounded-xl flex items-center justify-center text-2xl">
            <MdShoppingCart />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <div className="text-gray-500 text-sm font-medium">รายได้รวม</div>
            <div className="text-3xl font-bold mt-1 text-gray-900">฿{data.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 bg-red-50 text-[#ef4444] rounded-xl flex items-center justify-center text-2xl">
            <MdAttachMoney />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <div className="text-gray-500 text-sm font-medium">สลิปรอตรวจสอบ</div>
            <div className="text-3xl font-bold mt-1 text-[#ef4444]">{data.pendingSlips.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 bg-red-50 text-[#ef4444] rounded-xl flex items-center justify-center text-2xl">
            <MdOutlineReceiptLong />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#ef4444] rounded-full"></div>
            สถิติคำสั่งซื้อตามสถานะ
          </h3>
          <div className="space-y-4">
            {data.orderStats.map((stat) => (
              <div key={stat.status} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColor[stat.status] || "bg-gray-100 text-gray-600"}`}>
                  {statusLabel[stat.status] || stat.status}
                </span>
                <span className="font-bold text-lg text-gray-900">{stat._count.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#ef4444] rounded-full"></div>
            ข้อมูลสินค้า
          </h3>
          <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <span className="text-gray-500 font-medium">สินค้าทั้งหมดในระบบ</span>
            <span className="text-6xl font-black text-gray-900 mt-2">{data.totalProducts}</span>
            <button className="mt-6 text-[#ef4444] font-bold text-sm hover:underline">จัดการสินค้าทั้งหมด →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAnalytics
