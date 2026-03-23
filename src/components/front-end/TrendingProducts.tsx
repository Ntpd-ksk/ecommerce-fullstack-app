// ในคอมโพเนนต์ TrendingProducts นี้ เราใช้ useState เพื่อเก็บข้อมูลสินค้าที่กำลังมาแรงที่ได้รับจากการเรียก API ดังนั้นเราต้องเปลี่ยนชื่อของตัวแปร setProduct เป็นอย่างอื่น เพื่อไม่ให้เข้าสับสนกับฟังก์ชัน setProduct ที่ใช้สำหรับอัปเดตสถานะของข้อมูลสินค้า

"use client"
import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import axios from "axios"
import { setProduct } from "@/redux/features/productSlice"
import Product from "@/libs/models/Product"

interface IProduct {
    _id: string
    imgSrc: string
    fileKey: string
    name: string
    category: string
    price: number
}

const TrendingProducts = () => {

    const [products, setProduct] = useState([])

    useEffect(() => {
        axios
            .get("/api/get_products")
            .then((res) => {
                console.log(res.data)
                setProduct(res.data)
            })
            .catch((err) => console.log(err))
    }, [])


    return <div className="container mt-32">
        <div className="sm:flex justify-between items-center">
            <h2 className="text-4xl font-medium">สินค้าที่กำลังมาแรง</h2>

            <div className="text-gray-500 flex gap-4 text-xl mt-4 sm:mt-0">
                <div className="text-black">ใหม่</div>
                <div>ฟีเจอร์</div>
                <div>สินค้าขายดี</div>
            </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
            {products.map((item: IProduct) => (
                <ProductCard
                    key={item._id}
                    id={item._id}
                    img={item.imgSrc}
                    category={item.category}
                    title={item.name}
                    price={item.price}
                />
            ))}
        </div>
    </div>
}

export default TrendingProducts