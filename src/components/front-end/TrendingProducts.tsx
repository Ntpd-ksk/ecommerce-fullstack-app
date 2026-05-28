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
    searchQuery: string;
    filterType: string;
    setFilterType: (type: string) => void;
}

const TrendingProducts = ({ searchQuery, filterType, setFilterType }: PropsType) => {
    const [products, setProducts] = useState<IProduct[]>([])

    useEffect(() => {
        axios
            .get("/api/get_products")
            .then((res) => {
                setProducts(res.data)
            })
            .catch((err) => console.log(err))
    }, [])

    const categories = ["ทั้งหมด", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterType === "ทั้งหมด") return matchesSearch;
        return matchesSearch && product.category === filterType;
    });

    return (
        <div id="trending-products" className="container mt-32">
            <div className="sm:flex justify-between items-center">
                <h2 className="text-4xl font-medium">สินค้าที่กำลังมาแรง</h2>
                <div className="text-gray-500 flex gap-4 text-xl mt-4 sm:mt-0 flex-wrap">
                    {categories.map((cat) => (
                        <div
                            key={cat}
                            className={`${filterType === (cat === "ทั้งหมด" ? "ใหม่" : cat) || filterType === cat ? "text-black underline underline-offset-8 decoration-accent" : "hover:text-black cursor-pointer"} transition-colors whitespace-nowrap`}
                            onClick={() => setFilterType(cat)}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item: IProduct) => (
                        <ProductCard
                            key={item.id}
                            id={item.id}
                            img={item.imagePath}
                            title={item.name}
                            price={item.price}
                            discountPrice={item.discountPrice}
                            category={item.category || "สินค้าทั่วไป"}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        ไม่พบสินค้าที่คุณค้นหา
                    </div>
                )}
            </div>
        </div>
    )
}

export default TrendingProducts
