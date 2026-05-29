// โค้ดด้านบนเป็น Component ที่ชื่อ Sidebar ซึ่งใช้ในการแสดงเมนูของแอปพลิเคชัน

"use client"

import { MdDashboard, MdManageAccounts, MdOutlineHome, MdOutlineReceiptLong, MdPeople } from "react-icons/md"
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
    title: "แดชบอร์ดสรุปผล",
    icon: <IoAnalytics />,
    href: "/admin/dashboard-analytics",
  },
  {
    title: "รายการสินค้า",
    icon: <MdDashboard />,
    href: "/admin/dashboard",
  },
  {
    title: "เพิ่มสินค้า",
    icon: <RiShoppingCartLine />,
    href: "/admin/products",
  },
  {
    title: "ตรวจสอบสลิป",
    icon: <MdOutlineReceiptLong />,
    href: "/admin/slips",
  },
  {
    title: "บัญชีผู้ใช้",
    icon: <MdPeople />,
    href: "/admin/accounts",
  },
]

const Sidebar = () => {
  const pathName = usePathname()
  
  return <div className="bg-[#0a0a0a] w-[300px] min-h-screen p-6 shrink-0 border-r border-white/5 text-gray-400">
    <div className="flex items-center gap-4 mb-10">
      <img className="size-10 rounded-lg object-cover" src="/logo.jpg" alt="logo" />
      <h2 className="text-[22px] font-bold text-white tracking-tighter italic">NATAPOD <span className="text-[#ef4444]">SHOP</span></h2>
    </div>

<ul className="space-y-2">
  {menus.map(menu => (
  <Link
  key={menu.title}
  href={menu.href}
  className={`flex gap-3 items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
    pathName === menu.href
      ? "bg-[#ef4444] text-white shadow-lg shadow-red-600/20"
      : "hover:bg-white/5 hover:text-white"
    }`}
    >
      <div className={`text-[22px] transition-colors ${pathName === menu.href ? "text-white" : "group-hover:text-[#ef4444]"}`}>{menu.icon}</div>
      <p className="font-medium">{menu.title}</p>
    </Link>
    ))}
</ul>

  </div>
}

export default Sidebar