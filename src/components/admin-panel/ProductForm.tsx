"use client"
import { setLoading } from '@/redux/features/loadingSlice';
import { useAppDispatch } from '@/redux/hook';
import { makeToast } from '@/utils/helper';
import axios from 'axios';
import Image from "next/image"
import React, { FormEvent, useState, ChangeEvent } from 'react'
import { MdClose, MdCloudUpload } from "react-icons/md"

interface IPayload {
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
        name: "",
        brand: "",
        category: "",
        price: "",
        discountPrice: "",
        description: "",
    })
    const [specs, setSpecs] = useState<ISpec[]>([{ key: "", value: "" }])
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const dispatch = useAppDispatch()

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files
        if (!selectedFiles) return

        const newFiles = Array.from(selectedFiles)
        setFiles(prev => [...prev, ...newFiles])

        const newPreviews = newFiles.map(file => URL.createObjectURL(file))
        setPreviews(prev => [...prev, ...newPreviews])
    }

    const removeImage = (index: number) => {
        const newFiles = [...files]
        const newPreviews = [...previews]

        // Revoke URL to prevent memory leak
        URL.revokeObjectURL(newPreviews[index])

        newFiles.splice(index, 1)
        newPreviews.splice(index, 1)

        setFiles(newFiles)
        setPreviews(newPreviews)
    }

    const addSpec = () => setSpecs([...specs, { key: "", value: "" }])
    const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index))
    const updateSpec = (index: number, field: keyof ISpec, value: string) => {
        const newSpecs = [...specs]
        newSpecs[index][field] = value
        setSpecs(newSpecs)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (files.length === 0) {
            alert("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป")
            return
        }

        dispatch(setLoading(true))
        setUploading(true)

        try {
            const formData = new FormData()

            // Add basic fields
            formData.append("name", payload.name)
            formData.append("brand", payload.brand)
            formData.append("category", payload.category)
            formData.append("price", payload.price)
            formData.append("discountPrice", payload.discountPrice)
            formData.append("description", payload.description)

            // Add specs as JSON string
            const specsObj = specs.reduce((acc, curr) => {
                if (curr.key.trim()) acc[curr.key] = curr.value
                return acc
            }, {} as any)
            formData.append("specs", JSON.stringify(specsObj))
            formData.append("tags", JSON.stringify([])) // Default tags

            // Add multiple files
            files.forEach(file => {
                formData.append("files", file)
            })

            await axios.post("/api/add_product", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            makeToast("เพิ่มสินค้าสำเร็จ")

            // Reset form
            setPayload({
                name: "",
                brand: "",
                category: "",
                price: "",
                discountPrice: "",
                description: "",
            })
            setSpecs([{ key: "", value: "" }])
            setFiles([])
            previews.forEach(url => URL.revokeObjectURL(url))
            setPreviews([])

        } catch (err: any) {
            console.error(err)
            alert(err.response?.data?.msg || "Something went wrong")
        } finally {
            setUploading(false)
            dispatch(setLoading(false))
        }
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Image Preview Area */}
            <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block font-bold text-gray-700">รูปภาพสินค้า (อัปโหลดได้หลายรูป)</label>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-2">
                    {previews.map((url, index) => (
                        <div key={index} className="relative aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden group">
                            <Image src={url} fill className="object-cover" alt={`preview-${index}`} />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MdClose size={16} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                                {index === 0 ? "รูปหลัก" : `รูปที่ ${index + 1}`}
                            </div>
                        </div>
                    ))}

                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#ef4444] hover:bg-red-50 transition-all text-gray-400 hover:text-[#ef4444]">
                        <MdCloudUpload size={30} />
                        <span className="text-[10px] font-bold">เพิ่มรูปภาพ</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {uploading && <p className="text-xs text-[#ef4444] animate-pulse">กำลังดำเนินการ...</p>}
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
