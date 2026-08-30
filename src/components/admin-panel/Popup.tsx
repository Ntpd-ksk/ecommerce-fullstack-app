"use client"

import { setLoading } from '@/redux/features/loadingSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { makeToast } from '@/utils/helper'
import axios from 'axios'
import Image from "next/image"
import React, { Dispatch, FormEvent, SetStateAction, useState, ChangeEvent } from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { MdClose, MdCloudUpload } from "react-icons/md"

interface PropsType {
    setOpenPopup: Dispatch<SetStateAction<boolean>>
    setUpdateTable: Dispatch<SetStateAction<boolean>>
}

const Popup = ({ setOpenPopup, setUpdateTable }: PropsType) => {

    const productData = useAppSelector((state) => state.productReducer)
    const dispatch = useAppDispatch()

    const [inputData, setInputData] = useState({
        name: productData.name,
        brand: productData.brand || "",
        category: productData.category || "",
        price: productData.price,
        discountPrice: productData.discountPrice || "",
        stock: productData.stock !== undefined ? productData.stock : 0,
        description: productData.description || "",
    })

    // รูปภาพเดิมที่มีอยู่
    const [existingImages, setExistingImages] = useState(productData.images || [])
    // รูปภาพใหม่ที่จะอัปโหลด
    const [newFiles, setNewFiles] = useState<File[]>([])
    const [newPreviews, setNewPreviews] = useState<string[]>([])

    const getInitialSpecs = () => {
        const specs = productData.specs
        if (!specs) return [{ key: "", value: "" }]
        if (typeof specs === 'string') {
            try {
                const parsed = JSON.parse(specs)
                return Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) }))
            } catch (e) {
                return [{ key: "", value: "" }]
            }
        }
        return Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }))
    }

    const [specs, setSpecs] = useState(getInitialSpecs())

    const addSpec = () => setSpecs([...specs, { key: "", value: "" }])
    const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index))
    const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs]
        newSpecs[index][field] = value
        setSpecs(newSpecs)
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files
        if (!selectedFiles) return

        const filesArray = Array.from(selectedFiles)
        setNewFiles(prev => [...prev, ...filesArray])

        const previewsArray = filesArray.map(file => URL.createObjectURL(file))
        setNewPreviews(prev => [...prev, ...previewsArray])
    }

    const removeNewImage = (index: number) => {
        const updatedFiles = [...newFiles]
        const updatedPreviews = [...newPreviews]

        URL.revokeObjectURL(updatedPreviews[index])

        updatedFiles.splice(index, 1)
        updatedPreviews.splice(index, 1)

        setNewFiles(updatedFiles)
        setNewPreviews(updatedPreviews)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const specsObj = specs.reduce((acc, curr) => {
            if (curr.key.trim()) acc[curr.key] = curr.value
            return acc
        }, {} as any)

        dispatch(setLoading(true))

        try {
            const formData = new FormData()
            formData.append("name", inputData.name)
            formData.append("brand", inputData.brand)
            formData.append("category", inputData.category)
            formData.append("price", String(inputData.price))
            formData.append("discountPrice", String(inputData.discountPrice))
            formData.append("stock", String(inputData.stock))
            formData.append("description", inputData.description)
            formData.append("specs", JSON.stringify(specsObj))
            formData.append("tags", JSON.stringify([]))

            // ส่งไฟล์ใหม่
            newFiles.forEach(file => {
                formData.append("files", file)
            })

            // ในตัวอย่างนี้จะทำการเขียนทับรูปเดิมถ้ามีการอัปโหลดใหม่
            // หรือคุณสามารถเพิ่ม Logic เพื่อเลือกเก็บรูปเก่าไว้ได้
            formData.append("keepExistingImages", "false")

            await axios.put(`/api/edit_product/${productData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            makeToast("แก้ไขสินค้าสำเร็จ")
            setUpdateTable((prevState) => !prevState)
            setOpenPopup(false)
        } catch (err: any) {
            console.error(err)
            alert(err.response?.data?.msg || "Something went wrong")
        } finally {
            dispatch(setLoading(false))
        }
    }

    return <div className='fixed top-0 left-0 w-full h-screen bg-[#00000070] grid place-items-center z-50'>
        <div className='bg-white w-[800px] max-h-[90vh] overflow-y-auto py-8 rounded-lg relative shadow-2xl'>
            <IoIosCloseCircleOutline
                className='absolute text-3xl right-0 top-0 m-4 cursor-pointer hover:text-red-600 transition-colors'
                onClick={() => setOpenPopup(false)}
            />

            <h2 className='text-3xl font-bold text-center border-b pb-4'>รายละเอียดและแก้ไขสินค้า</h2>

            <form className="mt-6 px-8 space-y-6" onSubmit={handleSubmit}>

                {/* Image Section */}
                <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="font-bold text-gray-700">รูปภาพสินค้า (อัปโหลดใหม่เพื่อเปลี่ยนรูปทั้งหมด)</label>

                    <div className="grid grid-cols-4 gap-4">
                        {/* รูปเดิม */}
                        {newFiles.length === 0 && existingImages.map((img: any, index: number) => (
                            <div key={index} className="relative aspect-square bg-white rounded-lg border overflow-hidden">
                                <Image src={img.url} fill className="object-cover" alt="existing" />
                            </div>
                        ))}

                        {/* รูปใหม่ที่กำลังจะอัปโหลด */}
                        {newPreviews.map((url, index) => (
                            <div key={index} className="relative aspect-square bg-white rounded-lg border border-accent overflow-hidden group">
                                <Image src={url} fill className="object-cover" alt="new" />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MdClose size={14} />
                                </button>
                            </div>
                        ))}

                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-accent hover:bg-accent/5 transition-all text-gray-400 hover:text-accent">
                            <MdCloudUpload size={24} />
                            <span className="text-[10px] font-bold">อัปโหลดใหม่</span>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">ชื่อสินค้า</label>
                        <input
                            className='border border-gray-300 outline-accent px-4 py-2 rounded-lg w-full bg-white'
                            type="text"
                            value={inputData.name}
                            onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">แบรนด์</label>
                        <input
                            className='border border-gray-300 outline-accent px-4 py-2 rounded-lg w-full bg-white'
                            type="text"
                            value={inputData.brand}
                            onChange={(e) => setInputData({ ...inputData, brand: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">ประเภทสินค้า</label>
                        <input
                            className='border border-gray-300 outline-accent px-4 py-2 rounded-lg w-full bg-white'
                            type="text"
                            value={inputData.category}
                            onChange={(e) => setInputData({ ...inputData, category: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">ราคาปกติ (บาท)</label>
                        <input
                            className='border border-gray-300 outline-accent px-4 py-2 rounded-lg w-full bg-white'
                            type="text"
                            value={inputData.price}
                            onChange={(e) => setInputData({ ...inputData, price: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">ราคาโปรโมชั่น (ใส่เฉพาะที่ต้องการลดราคา)</label>
                        <input
                            className='border border-gray-300 outline-accent px-4 py-2 rounded-lg w-full bg-white'
                            type="text"
                            value={inputData.discountPrice}
                            onChange={(e) => setInputData({ ...inputData, discountPrice: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">จำนวนสินค้าคงเหลือ (สต็อก)</label>
                        <input
                            className='border border-gray-300 outline-accent px-4 py-2 rounded-lg w-full bg-white'
                            type="number"
                            min="0"
                            value={inputData.stock}
                            onChange={(e) => setInputData({ ...inputData, stock: parseInt(e.target.value) || 0 })}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-700">รายละเอียดสินค้า</label>
                    <textarea
                        className='border border-gray-300 outline-accent px-4 py-2 rounded-lg w-full bg-white'
                        rows={3}
                        value={inputData.description}
                        onChange={(e) => setInputData({ ...inputData, description: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                        <label className='font-bold text-gray-700'>คุณสมบัติสินค้า (Specifications)</label>
                        <button type="button" onClick={addSpec} className="text-sm bg-accent text-white px-3 py-1 rounded hover:bg-[#d41a1a] transition-colors">
                            + เพิ่มคุณสมบัติ
                        </button>
                    </div>
                    <div className="space-y-2">
                        {specs.map((spec, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    className='bg-white flex-1 px-4 py-2 border border-gray-300 outline-accent rounded-md'
                                    placeholder="หัวข้อ"
                                    value={spec.key}
                                    onChange={(e) => updateSpec(index, 'key', e.target.value)}
                                />
                                <input
                                    className='bg-white flex-1 px-4 py-2 border border-gray-300 outline-accent rounded-md'
                                    placeholder="ข้อมูล"
                                    value={spec.value}
                                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                />
                                <button type="button" onClick={() => removeSpec(index)} className="text-red-500 px-2">ลบ</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex justify-center gap-4 pt-4 pb-4'>
                    <button type="button" onClick={() => setOpenPopup(false)} className='border border-gray-300 text-gray-600 px-12 py-3 rounded-lg font-bold hover:bg-gray-100'>
                        ยกเลิก
                    </button>
                    <button className='bg-accent text-white px-12 py-3 rounded-lg font-bold hover:bg-[#d41a1a] shadow-md transition-all'>
                        บันทึกการแก้ไข
                    </button>
                </div>
            </form>
        </div>
    </div>
}

export default Popup
