
// โค้ดนี้เป็นส่วนของ Dashboard ใน Admin Panel ซึ่งจะแสดงรายการสินค้าทั้งหมดที่มีในระบบ และมีการจัดการ Popup สำหรับเพิ่มหรือแก้ไขสินค้า

// client สำหรับเชื่อมต่อกับ API
"use client"
// import component Popup จากไฟล์
import Popup from '@/components/admin-panel/Popup'
// import component ProductRow จากไฟล์ ProductRow
import ProductRow from '@/components/admin-panel/ProductRow'
//import action setLoading จาก slice
import { setLoading } from '@/redux/features/loadingSlice'
// import hook useAppDispatch จากไฟล์ hook
import { useAppDispatch } from '@/redux/hook'
// import axios, ไลบรารีที่ใช้ในการทำ HTTP request จากฝั่ง client ไปยัง server
import axios from 'axios'
// import React และ hooks useEffect และ useState เพื่อใช้ในการสร้าง component
import React, { useEffect, useState } from 'react'

// การกำหนด interface สำหรับรูปแบบข้อมูลของสินค้า
export interface IProduct {
  _id: string
  imgSrc: string
  fileKey: string
  name: string
  price: string
  category: string
}

// เป็น functional component ที่แสดงแผงควบคุมสำหรับการจัดการสินค้า
const Dashboard = () => {

  // ใช้ useState เพื่อเก็บสถานะของรายการสินค้า (products), สถานะการเปิดหรือปิด Popup (openPopup), และสถานะเพื่ออัพเดทตาราง (updateTable)
  const [products, setProducts] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [updateTable, setUpdateTable] = useState(false)

  const dispatch = useAppDispatch()

  // ใช้ useEffect เพื่อโหลดข้อมูลสินค้าเมื่อ component ถูกโหลดหรือ updateTable เปลี่ยนแปลง
  useEffect(() => {
    dispatch(setLoading(true))
    // ใช้ hook useEffect เพื่อเรียกใช้ axios เพื่อดึงข้อมูลสินค้าจาก API
    axios
    .get("/api/get_products")
    .then((res) => setProducts(res.data))
    .catch(err => console.log(err))
    .finally(() => dispatch(setLoading(false)))
  }, [updateTable])

  // แสดงหัวข้อ "สินค้าทั้งหมด" และตารางสำหรับแสดงข้อมูลสินค้า
  return <div>
    <div className='bg-white h-[calc(100vh-96px)] rounded-lg p-4'>
      <h2 className='text-3xl'>สินค้าทั้งหมด</h2>

      <div className='mt-4 h-[calc(100vh-180px)] overflow-y-auto'>
        <table className='w-full'>
          <thead>
            <tr className='text-gray-500 border-t border-[#ececec]'>
              <th>ลำดับ</th>
              <th>ชื่อ</th>
              <th>ราคา</th>
              <th>รูปภาพ</th>
              <th>แก้ไข/ลบ</th>
            </tr>
          </thead>
          <tbody>
          {/* ใช้ map function เพื่อแสดงข้อมูลสินค้าทุกรายการโดยใช้คอมโพเนนต์ ProductRow */}
            {products.map((product: IProduct, index) => (
              <ProductRow
                key={product._id}
                srNo={index + 1}
                setOpenPopup={setOpenPopup}
                setUpdateTable={setUpdateTable}
                product={product}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {openPopup && (
      <Popup setOpenPopup={setOpenPopup} setUpdateTable={setUpdateTable} />
    )}
  </div>
}

export default Dashboard