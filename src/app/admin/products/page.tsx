// โค้ดนี้เป็นหน้าสำหรับจัดการสินค้าใน Admin Panel ซึ่งมีฟอร์มสำหรับเพิ่มหรือแก้ไขข้อมูลสินค้า

//นำเข้าคอมโพเนนต์ ProductForm
import ProductForm from '@/components/admin-panel/ProductForm'
// นำเข้าโมดูล React เพื่อใช้ในการสร้าง functional component
import React from 'react'

// ประกาศ functional component ชื่อ Products ซึ่งเป็นหน้าที่แสดงฟอร์มสำหรับจัดการสินค้า
const Products = () => {
  return (
    <div className='h-[calc(100vh-96px)] w-full grid place-items-center overflow-y-auto'>
        <div className='bg-white w-[300px] rounded-lg p-4'>
        {/* เรียกใช้คอมโพเนนต์ ProductForm เพื่อแสดงฟอร์มสำหรับเพิ่มหรือแก้ไขข้อมูลสินค้า */}
            <ProductForm />
        </div>
    </div>
  )
}

export default Products