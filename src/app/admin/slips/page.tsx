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
    <div className='space-y-6'>
      <div className="flex justify-between items-center">
        <div>
          <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>จัดการคำสั่งซื้อ</h2>
          <p className="text-sm text-gray-500 mt-1">ตรวจสอบสลิปและสถานะการจัดส่งสินค้า</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-bold outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="">คำสั่งซื้อทั้งหมด</option>
            <option value="PENDING">รอชำระเงิน</option>
            <option value="VERIFYING">รอตรวจสอบสลิป</option>
            <option value="PAID">ชำระเงินแล้ว</option>
            <option value="SHIPPING">กำลังจัดส่ง</option>
            <option value="SUCCESS">สำเร็จ</option>
            <option value="CANCELLED">ยกเลิก</option>
          </select>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-[#0a0a0a] text-gray-300 text-[10px] uppercase tracking-widest font-bold'>
              <tr>
                <th className="px-6 py-4">วันที่ / เลขที่</th>
                <th className="px-6 py-4">ข้อมูลผู้ซื้อ</th>
                <th className="px-6 py-4">ยอดรวม</th>
                <th className="px-6 py-4 text-center">หลักฐานสลิป</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">ไม่พบข้อมูลคำสั่งซื้อในระบบ</td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors even:bg-gray-50/30">
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="font-mono text-[9px] text-gray-400 mt-1 uppercase">ID: {order.id.slice(-8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{order.user.name || 'ลูกค้าทั่วไป'}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">฿{Number(order.total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {order.paymentSlip ? (
                        <div
                          className="relative group cursor-zoom-in"
                          onClick={() => setSelectedSlip(order.paymentSlip)}
                        >
                          <img
                            src={order.paymentSlip}
                            alt="slip"
                            className="h-14 w-10 object-cover rounded-md border border-gray-200 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                            <span className="text-white text-[10px] font-bold">VIEW</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase italic">No Slip</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex gap-2">
                        {order.status === "VERIFYING" && (
                          <button
                            onClick={() => updateStatus(order.id, "PAID")}
                            className="bg-[#ef4444] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-600 shadow-sm shadow-red-600/10 transition-all"
                          >
                            ยืนยันสลิป
                          </button>
                        )}
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] font-bold outline-none cursor-pointer hover:border-[#ef4444] transition-all"
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
                        className="text-gray-400 hover:text-red-600 text-[10px] font-bold transition-colors uppercase tracking-widest"
                      >
                        [ DELETE ]
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSlip && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedSlip(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl animate-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h4 className="font-bold text-gray-900">Payment Evidence</h4>
              <button
                onClick={() => setSelectedSlip(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6 bg-gray-50 flex justify-center border-b border-gray-100">
              <img src={selectedSlip} alt="Full slip" className="max-h-[60vh] rounded-lg shadow-lg border border-white" />
            </div>
            <div className="p-4 flex gap-3">
              <button
                onClick={() => setSelectedSlip(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                Close
              </button>
              <button
                className="flex-1 py-3 bg-[#ef4444] text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-600/10 text-sm"
                onClick={() => {
                  // If we had the order ID here we could approve directly
                  setSelectedSlip(null);
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderManagementPage
