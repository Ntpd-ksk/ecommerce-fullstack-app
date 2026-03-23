// โค้ดด้านบนเป็น Component ที่ชื่อ Loader ซึ่งใช้ในการแสดงหน้าจอโหลดของแอปพลิเคชัน

import React from 'react'

// ประกาศฟังก์ชัน Loader ซึ่งเป็นฟังก์ชันที่ return หน้าจอโหลดของแอปพลิเคชัน
function Loader() {
  return (
    <div className="fixed w-full h-screen top-0 left-0 bg-[#0000006d] grid place-items-center">
        <span className="loader"></span>
    </div>
  )
}

export default Loader