//Component Banner คือส่วนที่ใช้ในการแสดงโฆษณาหรือข้อมูลสำคัญบนหน้าเว็บ
//มีการสลับรูปอัตโนมัติทุก 5 วินาที

"use client"

import React, { useEffect, useState, useRef } from "react"

const slides = [
  { image: "/product-banner-1.jpg", position: "bg-center" },
  { image: "/product-banner-2.jpg", position: "bg-right" },
  { image: "/product-banner-3.jpg", position: "bg-center" },
  { image: "/product-banner-4.png", position: "bg-center" },
  { image: "/product-banner-5.jpg", position: "bg-center" },
]

const Banner = () => {
  const [current, setCurrent] = useState(0)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = () => {
    stopTimer()
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const resetTimer = () => {
    startTimer()
  }

  useEffect(() => {
    startTimer()
    return () => stopTimer()
  }, [])

  const handleDotClick = (index: number) => {
    setCurrent(index)
    resetTimer()
  }

  const onMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientX)
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (dragStart !== null) {
      const diff = e.clientX - dragStart
      if (diff > 50) {
        setCurrent(prev => (prev - 1 + slides.length) % slides.length)
        resetTimer()
      } else if (diff < -50) {
        setCurrent(prev => (prev + 1) % slides.length)
        resetTimer()
      }
    }
    setDragStart(null)
  }

  return (
    <div className="container mt-32 relative group">
      <div
        className={`h-[540px] md:h-[720px] bg-cover rounded-xl pr-[15px] transition-all duration-700 ease-in-out cursor-grab active:cursor-grabbing`}
        style={{
          backgroundImage: `url(${slides[current].image})`,
          backgroundPosition: slides[current].position === "bg-right" ? "right center" : "center",
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={() => setDragStart(null)}
      >
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Banner
