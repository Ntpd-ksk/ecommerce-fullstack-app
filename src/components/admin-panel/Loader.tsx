// โค้ดด้านบนเป็น Component ที่ชื่อ Loader ซึ่งใช้ในการแสดงหน้าจอโหลดของแอปพลิเคชัน

import React from 'react'

// ประกาศฟังก์ชัน Loader ซึ่งเป็นฟังก์ชันที่ return หน้าจอโหลดของแอปพลิเคชัน
function Loader() {
  return (
    <div className="fixed w-full h-screen top-0 left-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#ef4444] rounded-full animate-spin"></div>
            <span className="text-white/80 text-sm font-bold uppercase tracking-widest">Loading...</span>
        </div>
    </div>
  )
}

export default Loader