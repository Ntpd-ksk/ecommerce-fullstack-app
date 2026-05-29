"use client"
import { setLoading } from '@/redux/features/loadingSlice';
import { useAppDispatch } from '@/redux/hook';
import { makeToast } from '@/utils/helper';
import axios from 'axios';
import Image from "next/image"
import React, { FormEvent, useState } from 'react'
import { MdClose } from "react-icons/md"

interface IPayload {
    imgSrc: null | string;
    name: string;
    brand: string;
    category: string;
    price: string;
    discountPrice: string;
    description: string;
}

interface ISpec {
    key: string;
    value: string;
}

const ProductForm = () => {
    const [payload, setPayload] = useState<IPayload>({
        imgSrc: null,
        name: "",
        brand: "",
        category: "",
        price: "",
        discountPrice: "",
        description: "",
    })
    const [specs, setSpecs] = useState<ISpec[]>([{ key: "", value: "" }])

    const [uploading, setUploading] = useState(false)
    const dispatch = useAppDispatch()

    const removeImage = () => {
        setPayload({ ...payload, imgSrc: null })
    }

    const addSpec = () => setSpecs([...specs, { key: "", value: "" }])
    const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index))
    const updateSpec = (index: number, field: keyof ISpec, value: string) => {
        const newSpecs = [...specs]
        newSpecs[index][field] = value
        setSpecs(newSpecs)
    }

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

        // Convert specs array to object
        const specsObj = specs.reduce((acc, curr) => {
            if (curr.key.trim()) acc[curr.key] = curr.value
            return acc
        }, {} as any)

        const finalPayload = {
            ...payload,
            specs: specsObj
        }

        axios.post("/api/add_product", finalPayload).then(res => {
            makeToast("เพิ่มสินค้าสำเร็จ")
            setPayload({
                imgSrc: null,
                name: "",
                brand: "",
                category: "",
                price: "",
                discountPrice: "",
                description: "",
            })
            setSpecs([{ key: "", value: "" }])
        }).catch(err => console.log(err)
        ).finally(() => dispatch(setLoading(false)))
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative w-full h-[300px] bg-gray-100 rounded-md overflow-hidden border border-gray-300 flex items-center justify-center">
                {payload.imgSrc ? (
                    <Image
                        className="object-contain"
                        src={payload.imgSrc}
                        fill
                        alt="product_image"
                    />
                ) : (
                    <div className="text-gray-400 text-sm font-medium">กรุณาอัปโหลดรูปภาพสินค้า</div>
                )}
            </div>

            <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block font-bold text-gray-700">รูปภาพสินค้า</label>

                {payload.imgSrc && (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 mb-2">
                        <div className="relative size-12 shrink-0">
                            <Image src={payload.imgSrc} fill className="object-cover rounded-md" alt="preview" />
                        </div>
                        <div className="flex-1 truncate text-xs text-gray-500 font-medium">
                            {payload.imgSrc.split('/').pop()}
                        </div>
                        <button
                            type="button"
                            onClick={removeImage}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="ลบรูปภาพ"
                        >
                            <MdClose size={18} />
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#ef4444] file:text-white hover:file:bg-red-600 cursor-pointer"
                />
                {uploading && <p className="text-xs text-[#ef4444] animate-pulse">กำลังอัปโหลด...</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className='font-bold text-gray-700 ml-1'>ชื่อสินค้า</label>
                    <input className='bg-white w-full px-4 py-2 border border-gray-300 outline-[#ef4444] rounded-md'
                        type="text"
                        placeholder="ระบุชื่อสินค้า"
                        value={payload.name}
                        onChange={(e) => setPayload({ ...payload, name: e.target.value })}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className='font-bold text-gray-700 ml-1'>แบรนด์</label>
                    <input className='bg-white w-full px-4 py-2 border border-gray-300 outline-[#ef4444] rounded-md'
                        type="text"
                        placeholder="ระบุแบรนด์"
                        value={payload.brand}
                        onChange={(e) => setPayload({ ...payload, brand: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className='font-bold text-gray-700 ml-1'>ประเภทสินค้า (Category)</label>
                    <input className='bg-white w-full px-4 py-2 border border-gray-300 outline-[#ef4444] rounded-md'
                        type="text"
                        placeholder="เช่น คีย์บอร์ด, หูฟัง"
                        value={payload.category}
                        onChange={(e) => setPayload({ ...payload, category: e.target.value })}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className='font-bold text-gray-700 ml-1'>ราคาสินค้า (บาท)</label>
                    <input className='bg-white w-full px-4 py-2 border border-gray-300 outline-[#ef4444] rounded-md'
                        type="text"
                        placeholder="0.00"
                        value={payload.price}
                        onChange={(e) => setPayload({ ...payload, price: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className='font-bold text-gray-700 ml-1'>ราคาที่ลดแล้ว (ใส่เฉพาะที่มีส่วนลด)</label>
                <input className='bg-white w-full px-4 py-2 border border-gray-300 outline-[#ef4444] rounded-md'
                    type="text"
                    placeholder="ใส่ราคาโปรโมชั่น"
                    value={payload.discountPrice}
                    onChange={(e) => setPayload({ ...payload, discountPrice: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className='font-bold text-gray-700 ml-1'>รายละเอียดสินค้า</label>
                <textarea className='bg-white w-full px-4 py-2 border border-gray-300 outline-[#ef4444] rounded-md'
                    rows={4}
                    placeholder="ระบุรายละเอียดสินค้าเบื้องต้น"
                    value={payload.description}
                    onChange={(e) => setPayload({ ...payload, description: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                    <label className='font-bold text-gray-700'>คุณสมบัติสินค้า (Specifications)</label>
                    <button type="button" onClick={addSpec} className="text-sm bg-[#ef4444] text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                        + เพิ่มคุณสมบัติ
                    </button>
                </div>
                <div className="space-y-2">
                    {specs.map((spec, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                className='bg-white flex-1 px-4 py-2 border border-gray-300 outline-[#ef4444] rounded-md'
                                placeholder="หัวข้อ (เช่น สี, วัสดุ)"
                                value={spec.key}
                                onChange={(e) => updateSpec(index, 'key', e.target.value)}
                            />
                            <input
                                className='bg-white flex-1 px-4 py-2 border border-gray-300 outline-[#ef4444] rounded-md'
                                placeholder="ข้อมูล"
                                value={spec.value}
                                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => removeSpec(index)}
                                className="text-red-500 px-2 hover:bg-red-50 rounded"
                            >
                                ลบ
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex justify-end mt-4'>
                <button
                    type="submit"
                    disabled={uploading}
                    className='bg-[#ef4444] text-white px-12 py-3 rounded-md font-bold text-lg hover:bg-red-600 disabled:bg-gray-400 transition-all shadow-md'
                >
                    เพิ่มสินค้าใหม่
                </button>
            </div>
        </form>
    )
}

export default ProductForm
