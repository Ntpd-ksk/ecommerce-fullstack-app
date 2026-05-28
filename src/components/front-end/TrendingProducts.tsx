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

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterType === "ใหม่") return matchesSearch;
        if (filterType === "ฟีเจอร์") return matchesSearch && (product.category === "feature" || product.brand === "Feature");
        if (filterType === "สินค้าขายดี") return matchesSearch && (product.category === "bestseller" || (product.price > 30000)); // Dummy logic if no category

        return matchesSearch;
    });

    return (
        <div id="trending-products" className="container mt-32">
            <div className="sm:flex justify-between items-center">
                <h2 className="text-4xl font-medium">สินค้าที่กำลังมาแรง</h2>
                <div className="text-gray-500 flex gap-4 text-xl mt-4 sm:mt-0">
                    <div
                        className={`${filterType === "ใหม่" ? "text-black underline underline-offset-8 decoration-accent" : "hover:text-black cursor-pointer"} transition-colors`}
                        onClick={() => setFilterType("ใหม่")}
                    >
                        ใหม่
                    </div>
                    <div
                        className={`${filterType === "ฟีเจอร์" ? "text-black underline underline-offset-8 decoration-accent" : "hover:text-black cursor-pointer"} transition-colors`}
                        onClick={() => setFilterType("ฟีเจอร์")}
                    >
                        ฟีเจอร์
                    </div>
                    <div
                        className={`${filterType === "สินค้าขายดี" ? "text-black underline underline-offset-8 decoration-accent" : "hover:text-black cursor-pointer"} transition-colors`}
                        onClick={() => setFilterType("สินค้าขายดี")}
                    >
                        สินค้าขายดี
                    </div>
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
                            category={item.brand || "สินค้าทั่วไป"}
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
