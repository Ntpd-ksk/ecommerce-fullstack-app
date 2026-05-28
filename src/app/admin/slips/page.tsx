"use client"
import { setLoading } from '@/redux/features/loadingSlice'
import { useAppDispatch } from '@/redux/hook'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface IOrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
  }
}

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
    phone: string
  }
  items: IOrderItem[]
}

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const fetchOrders = () => {
    dispatch(setLoading(true))
    const url = filterStatus ? `/api/admin/orders?status=${filterStatus}` : "/api/admin/orders"
    axios
      .get(url)
      .then((res) => {
        setOrders(res.data)
      })
      .catch(err => console.log(err))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    fetchOrders()
  }, [filterStatus])

  const updateStatus = (orderId: string, status: string) => {
    if (!confirm(`ต้องการเปลี่ยนสถานะเป็น ${status} หรือไม่?`)) return

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

  const deleteOrder = (orderId: string) => {
    if (!confirm("ยืนยันการลบคำสั่งซื้อ? การกระทำนี้ไม่สามารถย้อนกลับได้")) return

    dispatch(setLoading(true))
    axios.delete(`/api/admin/orders/${orderId}`)
      .then(() => {
        toast.success("ลบคำสั่งซื้อเรียบร้อยแล้ว")
        fetchOrders()
      })
      .catch(err => {
        console.error(err)
        toast.error("เกิดข้อผิดพลาดในการลบ")
      })
      .finally(() => dispatch(setLoading(false)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-gray-100 text-gray-600"
      case "VERIFYING": return "bg-yellow-100 text-yellow-600"
      case "PAID": return "bg-blue-100 text-blue-600"
      case "SHIPPING": return "bg-purple-100 text-purple-600"
      case "SUCCESS": return "bg-green-100 text-green-600"
      case "CANCELLED": return "bg-red-100 text-red-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className='bg-white h-[calc(100vh-96px)] rounded-lg p-4 flex flex-col'>
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-3xl'>จัดการคำสั่งซื้อ</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">กรองสถานะ:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1 text-sm outline-none"
          >
            <option value="">ทั้งหมด</option>
            <option value="PENDING">รอดำเนินการ (PENDING)</option>
            <option value="VERIFYING">รอตรวจสอบสลิป (VERIFYING)</option>
            <option value="PAID">ชำระเงินแล้ว (PAID)</option>
            <option value="SHIPPING">กำลังจัดส่ง (SHIPPING)</option>
            <option value="SUCCESS">สำเร็จ (SUCCESS)</option>
            <option value="CANCELLED">ยกเลิก (CANCELLED)</option>
          </select>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <table className='w-full text-left'>
          <thead className="sticky top-0 bg-white z-10">
            <tr className='text-gray-500 border-t border-b border-[#ececec]'>
              <th className="p-2">วันที่ / เลขที่</th>
              <th className="p-2">ผู้ซื้อ</th>
              <th className="p-2">รายการสินค้า</th>
              <th className="p-2">ยอดรวม</th>
              <th className="p-2">สลิป</th>
              <th className="p-2">สถานะ</th>
              <th className="p-2 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">ไม่พบข้อมูลคำสั่งซื้อ</td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#ececec] hover:bg-gray-50">
                <td className="p-2">
                  <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('th-TH')}</div>
                  <div className="font-mono text-[10px]">{order.id}</div>
                </td>
                <td className="p-2">
                  <div className="font-medium">{order.user.name}</div>
                  <div className="text-xs text-gray-400">{order.user.email}</div>
                  <div className="text-xs text-gray-400">{order.user.phone}</div>
                </td>
                <td className="p-2">
                  <div className="max-w-[200px]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs truncate">
                        • {item.product.name} x{item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-2 font-medium">฿{Number(order.total).toLocaleString()}</td>
                <td className="p-2">
                  {order.paymentSlip ? (
                    <img
                      src={order.paymentSlip}
                      alt="slip"
                      className="h-12 w-12 object-cover cursor-pointer border rounded hover:opacity-80"
                      onClick={() => setSelectedSlip(order.paymentSlip)}
                    />
                  ) : (
                    <span className="text-xs text-gray-300">ไม่มีสลิป</span>
                  )}
                </td>
                <td className="p-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-2 text-right">
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex gap-1">
                      {order.status === "VERIFYING" && (
                        <button
                          onClick={() => updateStatus(order.id, "PAID")}
                          className="bg-green-500 text-white px-2 py-1 rounded text-[10px] hover:bg-green-600"
                        >
                          ยืนยันสลิป
                        </button>
                      )}
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border rounded px-1 py-1 text-[10px] outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="VERIFYING">VERIFYING</option>
                        <option value="PAID">PAID</option>
                        <option value="SHIPPING">SHIPPING</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-red-500 hover:text-red-700 text-[10px] font-medium"
                    >
                      ลบคำสั่งซื้อ
                    </button>
                  </div>
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

export default OrderManagementPage
