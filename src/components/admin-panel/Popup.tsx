// โค้ดนี้เป็น Component ที่ชื่อ Popup ซึ่งใช้ในการแสดงหน้าต่าง Popup เพื่อแก้ไขข้อมูลสินค้า

import { setLoading } from '@/redux/features/loadingSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { makeToast } from '@/utils/helper'
import axios from 'axios'
import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io'

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
        description: productData.description || "",
    })

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        const specsObj = specs.reduce((acc, curr) => {
            if (curr.key.trim()) acc[curr.key] = curr.value
            return acc
        }, {} as any)

        dispatch(setLoading(true))

        const finalPayload = {
            ...inputData,
            specs: specsObj
        }

        axios.put(`/api/edit_product/${productData.id}`, finalPayload).then(res => {
            makeToast("แก้ไขสินค้าสำเร็จ")
            setUpdateTable((prevState) => !prevState)
        }).catch(err => console.log(err)
        ).finally(() => {
            dispatch(setLoading(false))
            setOpenPopup(false)
        })
    }

    return <div className='fixed top-0 left-0 w-full h-screen bg-[#00000070] grid place-items-center z-50'>
        <div className='bg-white w-[800px] max-h-[90vh] overflow-y-auto py-8 rounded-lg relative'>
            <IoIosCloseCircleOutline
                className='absolute text-3xl right-0 top-0 m-4 cursor-pointer hover:text-red-600'
                onClick={() => setOpenPopup(false)}
            />

            <h2 className='text-3xl font-bold text-center border-b pb-4'>รายละเอียดและแก้ไขสินค้า</h2>

            <form className="mt-6 px-8 space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">ชื่อสินค้า</label>
                        <input
                            className='border border-gray-300 outline-pink px-4 py-2 rounded-lg w-full bg-gray-50'
                            type="text"
                            placeholder='ชื่อสินค้า'
                            value={inputData.name}
                            onChange={(e) =>
                                setInputData({ ...inputData, name: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">แบรนด์</label>
                        <input
                            className='border border-gray-300 outline-pink px-4 py-2 rounded-lg w-full bg-gray-50'
                            type="text"
                            placeholder='แบรนด์'
                            value={inputData.brand}
                            onChange={(e) =>
                                setInputData({ ...inputData, brand: e.target.value })
                            }
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">ประเภทสินค้า</label>
                        <input
                            className='border border-gray-300 outline-pink px-4 py-2 rounded-lg w-full bg-gray-50'
                            type="text"
                            placeholder='ประเภทสินค้า'
                            value={inputData.category}
                            onChange={(e) =>
                                setInputData({ ...inputData, category: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-700">ราคาปกติ (บาท)</label>
                        <input
                            className='border border-gray-300 outline-pink px-4 py-2 rounded-lg w-full bg-gray-50'
                            type="text"
                            placeholder='ราคา'
                            value={inputData.price}
                            onChange={(e) =>
                                setInputData({ ...inputData, price: e.target.value })
                            }
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-700">ราคาโปรโมชั่น (ใส่เฉพาะที่ต้องการลดราคา)</label>
                    <input
                        className='border border-gray-300 outline-pink px-4 py-2 rounded-lg w-full bg-gray-50'
                        type="text"
                        placeholder='ราคาที่ลดแล้ว'
                        value={inputData.discountPrice}
                        onChange={(e) =>
                            setInputData({ ...inputData, discountPrice: e.target.value })
                        }
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-700">รายละเอียดสินค้า</label>
                    <textarea
                        className='border border-gray-300 outline-pink px-4 py-2 rounded-lg w-full bg-gray-50'
                        rows={4}
                        placeholder='ระบุข้อมูลสินค้า'
                        value={inputData.description}
                        onChange={(e) =>
                            setInputData({ ...inputData, description: e.target.value })
                        }
                    />
                </div>

                <div className="flex flex-col gap-3 p-4 bg-pink/5 rounded-lg border border-pink/20">
                    <div className="flex justify-between items-center">
                        <label className='font-bold text-gray-700'>คุณสมบัติสินค้า (Specifications)</label>
                        <button type="button" onClick={addSpec} className="text-sm bg-pink text-white px-3 py-1 rounded hover:bg-accent transition-colors">
                            + เพิ่มคุณสมบัติ
                        </button>
                    </div>
                    <div className="space-y-2">
                        {specs.map((spec, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    className='bg-white flex-1 px-4 py-2 border border-gray-300 outline-pink rounded-md'
                                    placeholder="หัวข้อ (เช่น สี, วัสดุ)"
                                    value={spec.key}
                                    onChange={(e) => updateSpec(index, 'key', e.target.value)}
                                />
                                <input
                                    className='bg-white flex-1 px-4 py-2 border border-gray-300 outline-pink rounded-md'
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

                <div className='flex justify-center gap-4 pt-4'>
                    <button type="button" onClick={() => setOpenPopup(false)} className='border border-gray-300 text-gray-600 px-12 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all'>
                        ยกเลิก
                    </button>
                    <button className='bg-pink text-white px-12 py-3 rounded-lg font-bold hover:bg-accent transition-all shadow-md'>
                        บันทึกการแก้ไข
                    </button>
                </div>
            </form>
        </div>
    </div>
}

export default Popup