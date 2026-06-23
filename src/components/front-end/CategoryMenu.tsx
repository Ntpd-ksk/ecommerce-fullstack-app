"use client"
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react"
import { AiOutlineAppstore } from "react-icons/ai"
import { BsHdd, BsLaptop, BsHeadphones, BsPhone, BsCamera, BsTv, BsSpeaker } from "react-icons/bs"
import { MdComputer, MdKeyboard } from "react-icons/md"
import axios from "axios"
import { useRouter, usePathname } from "next/navigation"

// Map categories to icons
const categoryIcons: Record<string, JSX.Element> = {
  "คอมพิวเตอร์": <MdComputer className="w-5 h-5" />,
  "หูฟัง": <BsHeadphones className="w-5 h-5" />,
  "สมาร์ทโฟน": <BsPhone className="w-5 h-5" />,
  "กล้อง": <BsCamera className="w-5 h-5" />,
  "ทีวี": <BsTv className="w-5 h-5" />,
  "เครื่องใช้ไฟฟ้า": <BsSpeaker className="w-5 h-5" />,
  "เคส/อุปกรณ์เสริม": <BsHdd className="w-5 h-5" />,
  "คีย์บอร์ด": <MdKeyboard className="w-5 h-5" />,
}

const getCategoryIcon = (category: string) => {
  // Try exact match first
  if (categoryIcons[category]) return categoryIcons[category]
  // Try partial match
  const key = Object.keys(categoryIcons).find((k) =>
    category.toLowerCase().includes(k.toLowerCase())
  )
  return key ? categoryIcons[key] : <BsLaptop className="w-5 h-5" />
}

interface PropsType {
  setFilterType?: Dispatch<SetStateAction<string>>;
  scrollToProducts?: () => void;
}

const CategoryMenu = ({ setFilterType, scrollToProducts }: PropsType) => {
  const [categories, setCategories] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    axios
      .get("/api/get_products")
      .then((res) => {
        const cats = Array.from(
          new Set(res.data.map((p: any) => p.category).filter(Boolean))
        ) as string[]
        setCategories(cats)
      })
      .catch(() => {})
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger button */}
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200 cursor-pointer whitespace-nowrap"
      >
        <AiOutlineAppstore className="text-lg" />
        <span>สินค้าทั้งหมด</span>
      </button>

      {/* Dropdown */}
      {isOpen && categories.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  if (pathname === "/") {
                    if (setFilterType) setFilterType(cat)
                    if (scrollToProducts) scrollToProducts()
                  } else {
                    router.push(`/?category=${encodeURIComponent(cat)}`)
                  }
                }}
                className="flex w-full items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors duration-150 text-left"
              >
                <span className="text-gray-500">{getCategoryIcon(cat)}</span>
                <span className="font-medium">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryMenu
