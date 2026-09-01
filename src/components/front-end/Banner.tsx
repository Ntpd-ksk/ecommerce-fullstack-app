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
    <section className="container my-12 md:my-16 relative group">
      <div
        className={`h-[420px] md:h-[600px] bg-cover rounded-3xl transition-all duration-700 ease-in-out cursor-grab active:cursor-grabbing shadow-lg border border-gray-100/50 overflow-hidden relative`}
        style={{
          backgroundImage: `url(${slides[current].image})`,
          backgroundPosition: slides[current].position === "bg-right" ? "right center" : "center",
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={() => setDragStart(null)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? "bg-white w-8 shadow-sm" : "bg-white/40 hover:bg-white/70 w-2.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Banner
