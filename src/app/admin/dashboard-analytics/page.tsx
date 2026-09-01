"use client"
import React, { useEffect, useState, useMemo } from 'react'
import { setLoading } from '@/redux/features/loadingSlice'
import { useAppDispatch } from '@/redux/hook'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  MdPeople,
  MdOutlineReceiptLong,
  MdAttachMoney,
  MdShoppingCart,
  MdTrendingUp,
  MdInventory2,
  MdWarningAmber,
  MdCalendarToday,
  MdFilterList,
  MdRefresh,
  MdArrowForward,
  MdShoppingBag
} from "react-icons/md"

interface IOrderStat {
  status: string
  _count: { status: number }
}

interface ITimeline {
  date: string
  revenue: number
  orders: number
}

interface ICategoryStat {
  category: string
  revenue: number
  count: number
}

interface ITopProduct {
  id: string
  name: string
  category: string
  image: string
  soldQty: number
  totalSales: number
}

interface ILowStockProduct {
  id: string
  name: string
  stock: number
  price: string
  category: string
  images: { url: string }[]
}

interface IRecentOrder {
  id: string
  total: string
  status: string
  paymentMethod: string
  createdAt: string
  user: {
    name: string | null
    email: string | null
  }
  items: {
    product: {
      name: string
    }
  }[]
}

interface IAnalytics {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  avgOrderValue: number
  pendingSlips: number
  orderStats: IOrderStat[]
  revenueTimeline: ITimeline[]
  categoryStats: ICategoryStat[]
  topProducts: ITopProduct[]
  lowStockProducts: ILowStockProduct[]
  recentOrders: IRecentOrder[]
}

const statusColor: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  VERIFYING: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  PAID: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  PROCESSING: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  SHIPPING: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  SUCCESS: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
}

const statusLabel: Record<string, string> = {
  PENDING: "รอชำระเงิน",
  VERIFYING: "รอตรวจสลิป",
  PAID: "ชำระเงินแล้ว",
  PROCESSING: "กำลังเตรียมจัดส่ง",
  SHIPPING: "กำลังจัดส่ง",
  SUCCESS: "สำเร็จ",
  CANCELLED: "ยกเลิก",
}

const categoryColors = [
  "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#64748b"
]

export default function DashboardAnalytics() {
  const [data, setData] = useState<IAnalytics | null>(null)
  const [range, setRange] = useState<string>("30days")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [activeTabChart, setActiveTabChart] = useState<"revenue" | "orders">("revenue")
  const [hoveredPoint, setHoveredPoint] = useState<ITimeline | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const dispatch = useAppDispatch()
  const router = useRouter()

  const fetchAnalytics = async () => {
    dispatch(setLoading(true))
    try {
      let url = `/api/admin/analytics?range=${range}`
      if (range === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`
      }
      const res = await axios.get(url)
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    if (range !== "custom" || (startDate && endDate)) {
      fetchAnalytics()
    }
  }, [range, startDate, endDate])

  // Chart computations (SVG Interactive Area / Bar Chart)
  const chartData = data?.revenueTimeline || []
  const maxRevenue = useMemo(() => {
    if (!chartData.length) return 1
    const max = Math.max(...chartData.map(d => d.revenue))
    return max === 0 ? 1000 : max * 1.15
  }, [chartData])

  const maxOrders = useMemo(() => {
    if (!chartData.length) return 1
    const max = Math.max(...chartData.map(d => d.orders))
    return max === 0 ? 10 : max * 1.2
  }, [chartData])

  // Donut chart angles for order statuses
  const totalStatusCount = useMemo(() => {
    if (!data?.orderStats) return 0
    return data.orderStats.reduce((acc, s) => acc + s._count.status, 0)
  }, [data?.orderStats])

  const statusPieSlices = useMemo(() => {
    if (!data?.orderStats || totalStatusCount === 0) return []
    let cumulativeAngle = 0
    return data.orderStats.map((stat, idx) => {
      const percentage = (stat._count.status / totalStatusCount) * 100
      const strokeDasharray = `${percentage} ${100 - percentage}`
      const strokeDashoffset = -cumulativeAngle
      cumulativeAngle += percentage
      return {
        status: stat.status,
        count: stat._count.status,
        percentage: percentage.toFixed(1),
        strokeDasharray,
        strokeDashoffset,
        color: categoryColors[idx % categoryColors.length]
      }
    })
  }, [data?.orderStats, totalStatusCount])

  const maxCategoryRevenue = useMemo(() => {
    if (!data?.categoryStats?.length) return 1
    return Math.max(...data.categoryStats.map(c => c.revenue)) || 1
  }, [data?.categoryStats])

  const handleGenerateMockData = async () => {
    if (!confirm("ต้องการจำลองคำสั่งซื้อและข้อมูลยอดขาย 28 รายการย้อนหลังใช่หรือไม่?")) return
    dispatch(setLoading(true))
    try {
      const res = await axios.get("/api/admin/seed-mock-data")
      alert(res.data.message || "สร้างข้อมูลจำลองสำเร็จ!")
      fetchAnalytics()
    } catch (err: any) {
      console.error(err)
      alert("เกิดข้อผิดพลาดในการสร้างข้อมูลจำลอง")
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">แดชบอร์ดสรุปและวิเคราะห์ผล</h1>
            <span className="bg-red-50 text-[#ef4444] text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Analytics Hub</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">วิเคราะห์ยอดขาย พฤติกรรมคำสั่งซื้อ และสต็อกสินค้าแบบ Real-time</p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Mock data generator button */}
          <button
            onClick={handleGenerateMockData}
            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-red-500/20 transition-all flex items-center gap-1.5"
            title="กดเพื่อสร้างออเดอร์และยอดขายจำลอง 28 รายการย้อนหลังทันที"
          >
            <span>🎲</span> จำลองข้อมูลสถิติ
          </button>

          {/* Quick Presets */}
          <div className="inline-flex bg-gray-100/80 p-1 rounded-xl text-xs font-semibold text-gray-600">
            {[
              { id: "today", label: "วันนี้" },
              { id: "7days", label: "7 วันล่าสุด" },
              { id: "30days", label: "30 วันล่าสุด" },
              { id: "all", label: "ทั้งหมด" },
              { id: "custom", label: "กำหนดเอง" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setRange(p.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  range === p.id
                    ? "bg-white text-gray-900 shadow-sm font-bold"
                    : "hover:text-gray-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom Date Inputs */}
          {range === "custom" && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1 rounded-xl text-xs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent outline-none text-gray-700 font-medium"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent outline-none text-gray-700 font-medium"
              />
            </div>
          )}

          <button
            onClick={fetchAnalytics}
            title="รีเฟรชข้อมูล"
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
          >
            <MdRefresh className="text-lg" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">รายได้รวม (ยอดขายสำเร็จ)</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                ฿{(data?.totalRevenue || 0).toLocaleString()}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2">
                <MdTrendingUp className="text-base" /> จากยอดที่ชำระเงินเรียบร้อยแล้ว
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#ef4444] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <MdAttachMoney />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-400"></div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">คำสั่งซื้อในช่วงเวลานี้</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                {(data?.totalOrders || 0).toLocaleString()}
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-2">
                เฉลี่ย ฿{(data?.avgOrderValue || 0).toLocaleString()} / ออเดอร์
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <MdShoppingCart />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-400"></div>
        </div>

        {/* Pending Slips Action Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">สลิปรอการตรวจสอบ</p>
              <h3 className="text-3xl font-black text-amber-500 mt-2">
                {(data?.pendingSlips || 0).toLocaleString()}
              </h3>
              <Link
                href="/admin/slips"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 mt-2 hover:underline"
              >
                ไปตรวจสลิปทันที <MdArrowForward />
              </Link>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <MdOutlineReceiptLong />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-400"></div>
        </div>

        {/* Total Users & System Products */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">สมาชิกและสินค้า</p>
              <div className="flex items-baseline gap-3 mt-2">
                <div>
                  <span className="text-2xl font-black text-gray-900">{(data?.totalUsers || 0).toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-1 font-medium">สมาชิก</span>
                </div>
                <span className="text-gray-300">|</span>
                <div>
                  <span className="text-2xl font-black text-gray-900">{(data?.totalProducts || 0).toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-1 font-medium">สินค้า</span>
                </div>
              </div>
              <p className="text-xs text-purple-600 font-medium mt-2">ผู้ใช้งานที่ลงทะเบียนในระบบ</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <MdPeople />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-400"></div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart (Revenue / Orders) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                แนวโน้มยอดขายและคำสั่งซื้อ
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">กราฟแสดงการเปลี่ยนแปลงตามช่วงเวลาที่เลือก</p>
            </div>

            {/* Toggle Mode */}
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
              <button
                onClick={() => setActiveTabChart("revenue")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTabChart === "revenue"
                    ? "bg-[#ef4444] text-white shadow-sm"
                    : "hover:text-gray-900"
                }`}
              >
                ยอดขาย (฿)
              </button>
              <button
                onClick={() => setActiveTabChart("orders")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTabChart === "orders"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "hover:text-gray-900"
                }`}
              >
                จำนวนออเดอร์ (รายการ)
              </button>
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="w-full h-72 relative">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                ไม่มีข้อมูลยอดขายในช่วงเวลานี้
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-between">
                {/* SVG Area */}
                <div className="relative flex-1 w-full">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 50, 100, 150, 200].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="800"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Area & Line */}
                    {(() => {
                      const points = chartData.map((d, idx) => {
                        const x = (idx / Math.max(chartData.length - 1, 1)) * 800
                        const val = activeTabChart === "revenue" ? d.revenue : d.orders
                        const maxVal = activeTabChart === "revenue" ? maxRevenue : maxOrders
                        const y = 200 - (val / maxVal) * 180
                        return { x, y, d }
                      })

                      const pathD = points.reduce(
                        (acc, p, i) =>
                          i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`,
                        ""
                      )
                      const areaD = `${pathD} L 800 200 L 0 200 Z`

                      const strokeColor = activeTabChart === "revenue" ? "#ef4444" : "#3b82f6"
                      const fillColor = activeTabChart === "revenue" ? "url(#revenueGrad)" : "url(#ordersGrad)"

                      return (
                        <g>
                          <path d={areaD} fill={fillColor} />
                          <path
                            d={pathD}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Points */}
                          {points.map((p, idx) => (
                            <circle
                              key={idx}
                              cx={p.x}
                              cy={p.y}
                              r={hoveredIndex === idx ? 6 : 3.5}
                              fill="#ffffff"
                              stroke={strokeColor}
                              strokeWidth={hoveredIndex === idx ? 3 : 2}
                              className="transition-all cursor-pointer"
                            />
                          ))}
                        </g>
                      )
                    })()}
                  </svg>

                  {/* Invisible Overlay Bars for smooth hover tooltip */}
                  <div className="absolute inset-0 flex">
                    {chartData.map((d, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-full cursor-pointer group relative"
                        onMouseEnter={() => {
                          setHoveredPoint(d)
                          setHoveredIndex(idx)
                        }}
                        onMouseLeave={() => {
                          setHoveredPoint(null)
                          setHoveredIndex(null)
                        }}
                      >
                        {hoveredIndex === idx && (
                          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-xl z-20 pointer-events-none whitespace-nowrap">
                            <div className="font-bold">{d.date}</div>
                            <div className="text-gray-300">
                              {activeTabChart === "revenue"
                                ? `฿${d.revenue.toLocaleString()}`
                                : `${d.orders} ออเดอร์`}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[11px] text-gray-400 font-medium mt-3 border-t border-gray-100 pt-2">
                  <span>{chartData[0]?.date}</span>
                  {chartData.length > 2 && (
                    <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
                  )}
                  <span>{chartData[chartData.length - 1]?.date}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Breakdown (Donut Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              สัดส่วนสถานะคำสั่งซื้อ
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">วิเคราะห์สัดส่วนคำสั่งซื้อทั้งหมด ({totalStatusCount} รายการ)</p>
          </div>

          <div className="my-6 flex items-center justify-center">
            {totalStatusCount === 0 ? (
              <div className="py-12 text-gray-400 text-sm">ไม่มีคำสั่งซื้อ</div>
            ) : (
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="3.5"
                  />
                  {statusPieSlices.map((slice, i) => (
                    <circle
                      key={i}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="3.5"
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-500"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase">ออเดอร์</span>
                  <span className="text-2xl font-black text-gray-900">{totalStatusCount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Status Legends */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {statusPieSlices.map((slice) => (
              <div
                key={slice.status}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  ></span>
                  <span className="font-semibold text-gray-700">
                    {statusLabel[slice.status] || slice.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{slice.count}</span>
                  <span className="text-gray-400 text-[10px]">({slice.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category (Bar Breakdown) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                ยอดขายแยกตามหมวดหมู่
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">หมวดหมู่ที่สร้างรายได้สูงสุด</p>
            </div>
          </div>

          {!data?.categoryStats?.length ? (
            <div className="py-12 text-center text-gray-400 text-sm">ยังไม่มียอดขายในหมวดหมู่ใด</div>
          ) : (
            <div className="space-y-4">
              {data.categoryStats.slice(0, 5).map((cat, idx) => {
                const percent = Math.round((cat.revenue / maxCategoryRevenue) * 100)
                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-800">{cat.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-normal">{cat.count} ชิ้น</span>
                        <span className="text-gray-900">฿{cat.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: categoryColors[idx % categoryColors.length]
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Low Stock Alert (Inventory Monitor) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MdWarningAmber className="text-amber-500 text-xl" />
                  สินค้าสต็อกต่ำ / ใกล้หมด
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">สินค้าที่มีจำนวนคงเหลือ ≤ 5 ชิ้น</p>
              </div>
              <Link
                href="/admin/dashboard"
                className="text-xs font-bold text-[#ef4444] hover:underline inline-flex items-center gap-1"
              >
                จัดการสต็อก <MdArrowForward />
              </Link>
            </div>

            {!data?.lowStockProducts?.length ? (
              <div className="py-12 text-center text-emerald-600 bg-emerald-50/50 rounded-xl text-sm font-medium">
                ✅ สต็อกสินค้าทุกรายการอยู่ในเกณฑ์ดี ไม่มีสินค้าใกล้หมด
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.lowStockProducts.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={encodeURI(p.images?.[0]?.url || "/placeholder.jpg")}
                        alt={p.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg"; }}
                        className="w-10 h-10 object-cover rounded-xl border border-gray-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-gray-400">{p.category}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                          p.stock === 0
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.stock === 0 ? "สินค้าหมด" : `เหลือ ${p.stock} ชิ้น`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MdShoppingBag className="text-[#ef4444] text-xl" />
                สินค้าขายดีอันดับต้นๆ (Top Sellers)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">สินค้าที่มียอดสั่งซื้อสูงสุดในช่วงเวลานี้</p>
            </div>
          </div>

          {!data?.topProducts?.length ? (
            <div className="py-12 text-center text-gray-400 text-sm">ยังไม่มีข้อมูลการขายสินค้า</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.topProducts.map((p, idx) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0
                          ? "bg-amber-400 text-white"
                          : idx === 1
                          ? "bg-gray-300 text-gray-800"
                          : idx === 2
                          ? "bg-amber-700 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <img
                      src={encodeURI(p.image || "/placeholder.jpg")}
                      alt={p.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg"; }}
                      className="w-10 h-10 object-cover rounded-xl border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-400">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-gray-900">ขายได้ {p.soldQty} ชิ้น</p>
                    <p className="text-[11px] text-[#ef4444] font-semibold">
                      ฿{p.totalSales.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MdOutlineReceiptLong className="text-blue-500 text-xl" />
                คำสั่งซื้อล่าสุด (Recent Orders)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">รายการคำสั่งซื้อ 6 ออเดอร์ล่าสุด</p>
            </div>
            <Link
              href="/admin/slips"
              className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              ดูสลิปทั้งหมด <MdArrowForward />
            </Link>
          </div>

          {!data?.recentOrders?.length ? (
            <div className="py-12 text-center text-gray-400 text-sm">ยังไม่มีคำสั่งซื้อ</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.recentOrders.map((ord) => {
                const badge = statusColor[ord.status] || {
                  bg: "bg-gray-50",
                  text: "text-gray-600",
                  border: "border-gray-200"
                }
                return (
                  <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 truncate">
                          {ord.user?.name || ord.user?.email || "ลูกค้าทั่วไป"}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {statusLabel[ord.status] || ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                        {ord.items?.[0]?.product?.name || "สินค้า"} • {new Date(ord.createdAt).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-gray-900">
                        ฿{Number(ord.total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
