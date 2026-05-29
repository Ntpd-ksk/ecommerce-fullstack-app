//Component Banner คือส่วนที่ใช้ในการแสดงโฆษณาหรือข้อมูลสำคัญบนหน้าเว็บ
//มีการสลับรูปอัตโนมัติทุก 5 วินาที

"use client"

import React, { useEffect, useState } from "react"

const slides = [
  { image: "/product-banner-1.jpg", position: "bg-center" },
  { image: "/product-banner-2.jpg", position: "bg-right" },
  { image: "/product-banner-3.jpg", position: "bg-center" },
  { image: "/product-banner-4.png", position: "bg-center" },
  { image: "/product-banner-5.jpg", position: "bg-center" },
]

const Banner = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="container mt-32">
      <div
        className="h-[540px] md:h-[720px] bg-cover rounded-xl pr-[15px] transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${slides[current].image})`,
          backgroundPosition: slides[current].position === "bg-right" ? "right center" : "center",
        }}
      >
      </div>
    </div>
  )
}

export default Banner
