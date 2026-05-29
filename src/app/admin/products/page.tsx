// โค้ดนี้เป็นหน้าสำหรับจัดการสินค้าใน Admin Panel ซึ่งมีฟอร์มสำหรับเพิ่มหรือแก้ไขข้อมูลสินค้า

//นำเข้าคอมโพเนนต์ ProductForm
import ProductForm from '@/components/admin-panel/ProductForm'
// นำเข้าโมดูล React เพื่อใช้ในการสร้าง functional component
import React from 'react'

// ประกาศ functional component ชื่อ Products ซึ่งเป็นหน้าที่แสดงฟอร์มสำหรับจัดการสินค้า
const Products = () => {
  return (
    <div className='max-w-4xl mx-auto space-y-6'>
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>เพิ่มสินค้าใหม่</h2>
            <p className="text-sm text-gray-500 mt-1">ระบุรายละเอียดเพื่อนำสินค้าขึ้นระบบ</p>
          </div>
        </div>
        <div className='bg-white rounded-2xl p-10 shadow-sm border border-gray-100'>
            <ProductForm />
        </div>
    </div>
  )
}

export default Products