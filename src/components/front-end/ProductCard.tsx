"use client"

import { AiOutlineShoppingCart, AiOutlineSafety } from "react-icons/ai"
import { useAppDispatch } from "@/redux/hook"
import { addToCart } from "@/redux/features/cartSlice"
import { makeToast } from "@/utils/helper"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { openAuthModal } from "@/redux/features/authModalSlice"

interface propsType {
  id: string
  img: string
  category: string
  title: string
  price: number
  discountPrice?: number
  warrantyTag?: string
}

const ProductCard = ({
  id,
  img,
  category,
  title,
  price,
  discountPrice,
  warrantyTag = "ประกัน 1 ปี",
}: propsType) => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const addProductToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      makeToast("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า")
      dispatch(openAuthModal())
      return
    }

    const finalPrice = discountPrice || price
    dispatch(addToCart({ id, img, title, price: finalPrice, quantity: 1 }))
    makeToast("เพิ่มสินค้าลงตะกร้าแล้ว")
  }

  const discountPercent =
    discountPrice && price > 0
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0

  return (
    <Link href={`/product/${id}`} className="block group">
      <div className="bg-white rounded-xl shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 ease-out-expo overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square bg-surface-muted p-4 flex items-center justify-center overflow-hidden">
          <img
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out-expo"
            src={img}
            alt={title}
            loading="lazy"
          />
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide truncate">
            {category}
          </p>

          <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>

          {/* Price */}
          <div className="pt-1">
            {discountPrice ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-lg font-bold text-primary">
                  ฿{discountPrice.toLocaleString()}
                </span>
                <span className="text-xs text-text-muted line-through">
                  ฿{price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary">
                ฿{price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Footer: Warranty + Cart */}
          <div className="flex items-center justify-between pt-2 border-t border-border-light">
            <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
              <AiOutlineSafety className="text-primary" size={14} />
              {warrantyTag}
            </span>

            <button
              type="button"
              aria-label="เพิ่มลงตะกร้า"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer"
              onClick={addProductToCart}
            >
              <AiOutlineShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
