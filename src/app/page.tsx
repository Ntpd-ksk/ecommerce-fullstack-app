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
import React, { useState, useEffect } from "react";

const Home = () => {
  // สร้าง state ชื่อ showCart โดยใช้ useState ซึ่งเริ่มต้นด้วยค่าเริ่มต้นเป็น false เพื่อแสดงว่าตะกร้าสินค้าไม่ถูกแสดงอยู่
  const [showCart, setShowCart] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("ทั้งหมด")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const categoryParam = params.get('category')
      if (categoryParam) {
        setFilterType(categoryParam)
        setTimeout(() => {
          scrollToProducts()
        }, 300)
      }
    }
  }, [])

  const scrollToProducts = () => {
    const element = document.getElementById("trending-products")
    if (element) {
      // Get the element's position
      const yOffset = -100; // Offset to see the heading
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  return <main className="min-h-screen flex flex-col justify-between">
    {/* ส่ง setShowCart เป็น props เพื่อให้ Navbar Component สามารถเปลี่ยนแปลงค่า showCart ได้ */}
    <Navbar setShowCart={setShowCart} setSearchQuery={setSearchQuery} scrollToProducts={scrollToProducts} setFilterType={setFilterType} />
    {/* ใช้ตัวแปร showCart เพื่อตรวจสอบว่าตะกร้าสินค้าควรถูกแสดงหรือไม่ ถ้า showCart เป็น true จะแสดง Component Cart */}
    {showCart && <Cart setShowCart={setShowCart} />}
    {/* แสดง Component ตามลำดับ */}
    <Hero scrollToProducts={scrollToProducts} />
    <Feature />
    <TrendingProducts searchQuery={searchQuery} filterType={filterType} setFilterType={setFilterType} />
    <Banner />
    <Footer />
  </main>
}

export default Home;