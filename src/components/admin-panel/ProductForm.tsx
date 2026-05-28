"use client"
import { setLoading } from '@/redux/features/loadingSlice';
import { useAppDispatch } from '@/redux/hook';
import { makeToast } from '@/utils/helper';
import axios from 'axios';
import Image from "next/image"
import React, { FormEvent, useState } from 'react'

interface IPayload {
    imgSrc: null | string;
    name: string;
    category: string;
    price: string;
}

const ProductForm = () => {
    const [payload, setPayload] = useState<IPayload>({
        imgSrc: null,
        name: "",
        category: "",
        price: ""
    })

    const [uploading, setUploading] = useState(false)
    const dispatch = useAppDispatch()

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await axios.post('/api/upload', formData)
            setPayload({ ...payload, imgSrc: res.data.url })
            makeToast("อัปโหลดรูปภาพสำเร็จ")
        } catch (err: any) {
            console.error(err)
            alert(err.response?.data?.error || "อัปโหลดล้มเหลว")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!payload.imgSrc) {
            alert("กรุณาอัปโหลดรูปภาพก่อน")
            return
        }

        dispatch(setLoading(true))

        axios.post("/api/add_product", payload).then(res => {
            makeToast("เพิ่มสินค้าสำเร็จ")
            setPayload({
                imgSrc: null,
                name: "",
                category: "",
                price: ""
            })
        }).catch(err => console.log(err)
        ).finally(() => dispatch(setLoading(false)))
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative w-full h-[300px] bg-gray-200 rounded-md overflow-hidden">
                <Image
                    className="object-contain"
                    src={payload.imgSrc ? payload.imgSrc : "/placeholder.jpg"}
                    fill
                    alt="product_image"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="block ml-1 font-medium">รูปภาพสินค้า</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink file:text-white hover:file:bg-accent cursor-pointer"
                />
                {uploading && <p className="text-xs text-pink">กำลังอัปโหลด...</p>}
            </div>

            <div>
                <label className='block ml-1'>ชื่อสินค้า</label>
                <input className='bg-gray-300 w-full px-4 py-2 border outline-pink rounded-md'
                    type="text"
                    value={payload.name}
                    onChange={(e) => setPayload({ ...payload, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className='block ml-1'>ประเภทสินค้า</label>
                <input className='bg-gray-300 w-full px-4 py-2 border outline-pink rounded-md'
                    type="text"
                    value={payload.category}
                    onChange={(e) => setPayload({ ...payload, category: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className='block ml-1'>ราคาสินค้า</label>
                <input className='bg-gray-300 w-full px-4 py-2 border outline-pink rounded-md'
                    type="text"
                    value={payload.price}
                    onChange={(e) => setPayload({ ...payload, price: e.target.value })}
                    required
                />
            </div>

            <div className='flex justify-end'>
                <button
                    type="submit"
                    disabled={uploading}
                    className='bg-pink text-white px-8 py-2 rounded-md hover:bg-accent disabled:bg-gray-400'
                >
                    เพิ่มสินค้า
                </button>
            </div>
        </form>
    )
}

export default ProductForm
