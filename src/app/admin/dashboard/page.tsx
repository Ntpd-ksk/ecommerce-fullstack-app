"use client"
import Popup from '@/components/admin-panel/Popup'
import ProductRow from '@/components/admin-panel/ProductRow'
import { setLoading } from '@/redux/features/loadingSlice'
import { useAppDispatch } from '@/redux/hook'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface IProduct {
  id: string
  images: { url: string }[]
  name: string
  brand: string
  sku: string
  description: string
  price: string
  discountPrice: string
  category: string
  warranty: string
  stock: number
  tags: string | string[]
  specs: any
}

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [updateTable, setUpdateTable] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter() // Add useRouter for navigation

  useEffect(() => {
    dispatch(setLoading(true))
    axios
    .get("/api/get_products")
    .then((res) => setProducts(res.data))
    .catch(err => console.log(err))
    .finally(() => dispatch(setLoading(false)))
  }, [updateTable])

  return <div className="space-y-6">
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>สินค้าทั้งหมด</h2>
          <p className="text-sm text-gray-500 mt-1">จัดการและแก้ไขข้อมูลสินค้าของคุณ</p>
        </div>
        <button
          onClick={() => router.push('/admin/products')}
          className="bg-[#ef4444] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
        >
          <span>+</span> เพิ่มสินค้าใหม่
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-[#0a0a0a] text-gray-300 text-[11px] uppercase tracking-widest'>
            <tr>
              <th className="px-6 py-4 font-bold">ลำดับ</th>
              <th className="px-6 py-4 font-bold">รูปภาพ</th>
              <th className="px-6 py-4 font-bold">ชื่อสินค้า</th>
              <th className="px-6 py-4 font-bold">ราคา</th>
              <th className="px-6 py-4 font-bold text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product: IProduct, index) => (
              <ProductRow
                key={product.id}
                srNo={index + 1}
                setOpenPopup={setOpenPopup}
                setUpdateTable={setUpdateTable}
                product={product}
              />
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-medium">
            ไม่พบข้อมูลสินค้าในระบบ
          </div>
        )}
      </div>
    </div>

    {openPopup && (
      <Popup setOpenPopup={setOpenPopup} setUpdateTable={setUpdateTable} />
    )}
  </div>
}

export default Dashboard
