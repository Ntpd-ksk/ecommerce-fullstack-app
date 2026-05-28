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
    PENDING: "bg-yellow-100 text-yellow-600",
    VERIFYING: "bg-orange-100 text-orange-600",
    PAID: "bg-blue-100 text-blue-600",
    SHIPPING: "bg-purple-100 text-purple-600",
    SUCCESS: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-600",
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
    <div className='h-[calc(100vh-96px)] overflow-y-auto'>
      <h2 className='text-3xl'>ภาพรวมและสถิติ</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-gray-500 text-sm">สมาชิกทั้งหมด</div>
          <div className="text-3xl font-semibold mt-1">{data.totalUsers}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-gray-500 text-sm">คำสั่งซื้อทั้งหมด</div>
          <div className="text-3xl font-semibold mt-1">{data.totalOrders}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-gray-500 text-sm">รายได้รวม</div>
          <div className="text-3xl font-semibold mt-1">฿{data.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-gray-500 text-sm">สลิปรอตรวจสอบ</div>
          <div className="text-3xl font-semibold mt-1">{data.pendingSlips}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">สถิติคำสั่งซื้อตามสถานะ</h3>
          <div className="space-y-3">
            {data.orderStats.map((stat) => (
              <div key={stat.status} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm ${statusColor[stat.status] || "bg-gray-100 text-gray-600"}`}>
                  {statusLabel[stat.status] || stat.status}
                </span>
                <span className="font-semibold">{stat._count.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">ข้อมูลสินค้า</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">สินค้าทั้งหมด</span>
            <span className="text-2xl font-semibold">{data.totalProducts}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAnalytics
