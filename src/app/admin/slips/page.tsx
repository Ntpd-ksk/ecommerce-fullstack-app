"use client"
import { setLoading } from '@/redux/features/loadingSlice'
import { useAppDispatch } from '@/redux/hook'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface IOrder {
  id: string
  total: number
  status: string
  paymentMethod: string
  paymentSlip: string | null
  createdAt: string
  user: {
    name: string
    email: string
  }
}

const SlipsPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const fetchOrders = () => {
    dispatch(setLoading(true))
    axios
      .get("/api/admin/orders?status=VERIFYING")
      .then((res) => {
        setOrders(res.data)
      })
      .catch(err => console.log(err))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = (orderId: string, status: string) => {
    dispatch(setLoading(true))
    axios.patch(`/api/admin/orders/${orderId}/status`, { status })
      .then(() => {
        toast.success(`อัปเดตสถานะเป็น ${status} เรียบร้อยแล้ว`)
        fetchOrders()
      })
      .catch(err => {
        console.error(err)
        toast.error("เกิดข้อผิดพลาดในการอัปเดต")
      })
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <div className='bg-white h-[calc(100vh-96px)] rounded-lg p-4'>
      <h2 className='text-3xl'>ตรวจสอบสลิปและอัปเดตสถานะ</h2>

      <div className='mt-4 h-[calc(100vh-180px)] overflow-y-auto'>
        <table className='w-full text-left'>
          <thead>
            <tr className='text-gray-500 border-t border-[#ececec]'>
              <th className="p-2">วันที่</th>
              <th className="p-2">ผู้ซื้อ</th>
              <th className="p-2">ยอดรวม</th>
              <th className="p-2">สลิป</th>
              <th className="p-2">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">ไม่มีสลิปที่รอตรวจสอบ</td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-[#ececec]">
                <td className="p-2">{new Date(order.createdAt).toLocaleString('th-TH')}</td>
                <td className="p-2">
                  <div>{order.user.name}</div>
                  <div className="text-xs text-gray-400">{order.user.email}</div>
                </td>
                <td className="p-2">฿{Number(order.total).toLocaleString()}</td>
                <td className="p-2">
                  {order.paymentSlip && (
                    <img
                      src={order.paymentSlip}
                      alt="slip"
                      className="h-20 w-auto cursor-pointer border hover:opacity-80"
                      onClick={() => setSelectedSlip(order.paymentSlip)}
                    />
                  )}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => updateStatus(order.id, "PAID")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                  >
                    ยืนยันชำระเงิน
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "CANCELLED")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                  >
                    สลิปไม่ถูกต้อง
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSlip(null)}>
          <div className="bg-white p-2 rounded-lg max-w-full max-h-full">
            <img src={selectedSlip} alt="Full slip" className="max-w-full max-h-[90vh]" />
          </div>
        </div>
      )}
    </div>
  )
}

export default SlipsPage
