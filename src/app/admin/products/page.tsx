// โค้ดนี้เป็นหน้าสำหรับจัดการสินค้าใน Admin Panel ซึ่งมีฟอร์มสำหรับเพิ่มหรือแก้ไขข้อมูลสินค้า

//นำเข้าคอมโพเนนต์ ProductForm
import ProductForm from '@/components/admin-panel/ProductForm'
// นำเข้าโมดูล React เพื่อใช้ในการสร้าง functional component
import React from 'react'

// ประกาศ functional component ชื่อ Products ซึ่งเป็นหน้าที่แสดงฟอร์มสำหรับจัดการสินค้า
const Products = () => {
  return (
    <div className='h-[calc(100vh-96px)] w-full overflow-y-auto'>
        <div className='bg-white max-w-3xl mx-auto rounded-lg p-8'>
            <h2 className='text-3xl font-bold mb-6'>เพิ่มสินค้าใหม่</h2>
            <ProductForm />
        </div>
    </div>
  )
}

export default Products