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
}

const TrendingProducts = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios
            .get("/api/get_products")
            .then((res) => {
                setProducts(res.data)
            })
            .catch((err) => console.log(err))
    }, [])

    return (
        <div className="container mt-32">
            <div className="sm:flex justify-between items-center">
                <h2 className="text-4xl font-medium">สินค้าที่กำลังมาแรง</h2>
                <div className="text-gray-500 flex gap-4 text-xl mt-4 sm:mt-0">
                    <div className="text-black underline underline-offset-8 decoration-accent">ใหม่</div>
                    <div className="hover:text-black cursor-pointer transition-colors">ฟีเจอร์</div>
                    <div className="hover:text-black cursor-pointer transition-colors">สินค้าขายดี</div>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
                {products.map((item: IProduct) => (
                    <ProductCard
                        key={item.id}
                        id={item.id}
                        img={item.imagePath}
                        title={item.name}
                        price={item.price}
                        discountPrice={item.discountPrice}
                        category={item.brand || "สินค้าทั่วไป"}
                    />
                ))}
            </div>
        </div>
    )
}

export default TrendingProducts
