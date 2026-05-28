// โค้ดด้านบนเป็น Component ที่ชื่อ Sidebar ซึ่งใช้ในการแสดงเมนูของแอปพลิเคชัน

"use client"

import { MdDashboard, MdManageAccounts, MdOutlineHome } from "react-icons/md"
import { GrTransaction } from "react-icons/gr"
import { IoAnalytics, IoSettings } from "react-icons/io5"
import { RiShoppingCartLine } from "react-icons/ri"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menus =[
  {
    title: "กลับหน้าหลัก",
    icon: <MdOutlineHome />,
    href: "/",
  },
  {
    title: "รายการสินค้าทั้งหมด",
    icon: <MdDashboard />,
    href: "/admin/dashboard",
  },
  {
    title: "เพิ่มสินค้า",
    icon: <RiShoppingCartLine />,
    href: "/admin/products",
  },
]

const Sidebar = () => {
  const pathName = usePathname()
  
  return <div className="bg-white w-[300px] min-h-screen p-4 shrink-0">
    <div className="flex items-center gap-4">
      <img className="size-12 rounded-lg" src="/logo.jpg" alt="logo" />
      <h2 className="text-[20px] font-semibold">Natapod Shop</h2>
    </div>

<ul className="space-y-4 mt-6">
  {menus.map(menu => (
  <Link
  key={menu.title}
  href={menu.href}
  className={`flex gap-2 items-center p-4 rounded-lg cursor-pointer hover:bg-pink
  hover:text-white ${
    pathName === menu.href ? "bg-pink text-white": "bg-gray-200"
    }`}
    >
      <div className="text-[20px]">{menu.icon}</div>
      <p>{menu.title}</p>
    </Link>
    ))}
</ul>

  </div>
}

export default Sidebar