"use client"
import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import axios from "axios"

interface IProduct {
  id: string
  imagePath: string
  name: string
  brand: string
  price: number
  discountPrice?: number
  category?: string
}

interface PropsType {
  searchQuery: string
  filterType: string
  setFilterType: (type: string) => void
}

const TrendingProducts = ({ searchQuery, filterType, setFilterType }: PropsType) => {
  const [products, setProducts] = useState<IProduct[]>([])

  useEffect(() => {
    axios
      .get("/api/get_products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
  }, [])

  const categories = ["ทั้งหมด", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (filterType === "ทั้งหมด") return matchesSearch
    return matchesSearch && product.category === filterType
  })

  return (
    <section id="trending-products" className="container py-16 md:py-24">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-heading text-text-primary">
            สินค้าที่กำลังมาแรง
          </h2>
          <p className="text-text-secondary mt-1 text-sm">
            ค้นพบสินค้ายอดนิยมที่ผู้ซื้อเลือกมากที่สุด
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const isActive = filterType === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterType(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-white shadow-btn-red"
                    : "bg-surface-muted text-text-secondary hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Product grid — responsive: 2 / 3 / 4 / 5 cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item: IProduct) => (
            <ProductCard
              key={item.id}
              id={item.id}
              img={item.imagePath}
              title={item.name}
              price={item.price}
              discountPrice={item.discountPrice}
              category={item.category || item.brand || "สินค้าทั่วไป"}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-text-muted">
            <svg className="w-16 h-16 mb-4 text-text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium">ไม่พบสินค้าที่คุณค้นหา</p>
            <p className="text-sm mt-1">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default TrendingProducts
