// โค้ดนี้เป็นหน้า Home ของแอปพลิเคชันที่ใช้ React ซึ่งประกอบด้วย Component ต่างๆ เพื่อสร้างหน้าแสดงผลหลักของเว็บไซต์

"use client"
import Banner from "@/components/front-end/Banner";
import Cart from "@/components/front-end/Cart";
import Feature from "@/components/front-end/Feature";
import Footer from "@/components/front-end/Footer";
import Hero from "@/components/front-end/Hero";
import Navbar from "@/components/front-end/Navbar";
import TrendingProducts from "@/components/front-end/TrendingProducts";
// นำเข้า React และ useState เพื่อใช้ในการจัดการสถานะของ Component
import React, { useState } from "react";

const Home = () => {
  // สร้าง state ชื่อ showCart โดยใช้ useState ซึ่งเริ่มต้นด้วยค่าเริ่มต้นเป็น false เพื่อแสดงว่าตะกร้าสินค้าไม่ถูกแสดงอยู่
  const [showCart, setShowCart] = useState(false)
  
  
  return <main>
    {/* ส่ง setShowCart เป็น props เพื่อให้ Navbar Component สามารถเปลี่ยนแปลงค่า showCart ได้ */}
    <Navbar setShowCart={setShowCart} />
    {/* ใช้ตัวแปร showCart เพื่อตรวจสอบว่าตะกร้าสินค้าควรถูกแสดงหรือไม่ ถ้า showCart เป็น true จะแสดง Component Cart */}
    {showCart && <Cart setShowCart={setShowCart} />}
    {/* แสดง Component ตามลำดับ */}
    <Hero />
    <Feature />
    <TrendingProducts />
    <Banner />
    <Footer />
  </main>
}

export default Home;