"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft, AiOutlineDelete, AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart } from "react-icons/ai";
import Navbar from "@/components/front-end/Navbar";
import Footer from "@/components/front-end/Footer";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { removeFromCart, updateQuantity } from "@/redux/features/cartSlice";
import Link from "next/link";

export default function CartPage() {
    const products = useAppSelector((state) => state.cartReducer);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { status } = useSession();

    const subtotal = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const vat = subtotal * 0.07;
    const shipping = subtotal > 5000 || products.length === 0 ? 0 : 50;
    const total = subtotal + vat + shipping;

    if (products.length === 0) {
        return (
            <main className="bg-[#f5f7f9] min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="bg-white p-12 rounded-2xl shadow-sm inline-block">
                        <AiOutlineShoppingCart size={80} className="mx-auto text-gray-200 mb-6" />
                        <h2 className="text-2xl font-bold mb-4">ตะกร้าของคุณว่างเปล่า</h2>
                        <p className="text-gray-500 mb-8">ไปเลือกช้อปสินค้าที่น่าสนใจกันเถอะ</p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d41a1a] transition-all"
                        >
                            ไปเลือกซื้อสินค้า
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="bg-[#f5f7f9] min-h-screen">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <AiOutlineShoppingCart className="text-accent" />
                        ตะกร้าสินค้า ({products.length})
                    </h1>
                    <button onClick={() => router.push("/")} className="text-gray-600 hover:text-accent flex items-center gap-2 font-medium">
                        <AiOutlineArrowLeft /> เลือกซื้อสินค้าเพิ่ม
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Items List */}
                    <div className="flex-[2] space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="hidden md:grid grid-cols-5 gap-4 p-6 bg-gray-50 border-b text-sm font-bold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-2">สินค้า</div>
                                <div className="text-center">ราคา</div>
                                <div className="text-center">จำนวน</div>
                                <div className="text-right">ราคารวม</div>
                            </div>

                            <div className="divide-y">
                                {products.map((item) => (
                                    <div key={item.id} className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-center group">
                                        <div className="col-span-2 flex gap-4 items-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-xl border flex-shrink-0 p-2">
                                                <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-800 truncate hover:text-accent transition-colors cursor-pointer" onClick={() => router.push(`/product/${item.id}`)}>{item.title}</h3>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 mt-2 transition-colors"
                                                >
                                                    <AiOutlineDelete /> นำออก
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-center font-medium text-gray-600">
                                            <span className="md:hidden text-xs text-gray-400 block mb-1">ราคา:</span>
                                            ฿{item.price.toLocaleString()}
                                        </div>

                                        <div className="flex justify-center">
                                            <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                                                <button
                                                    onClick={() => item.quantity > 1 && dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                    className="p-2 hover:bg-gray-200 transition-colors text-gray-500"
                                                >
                                                    <AiOutlineMinus size={14} />
                                                </button>
                                                <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                    className="p-2 hover:bg-gray-200 transition-colors text-gray-500"
                                                >
                                                    <AiOutlinePlus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right font-bold text-accent text-lg">
                                            <span className="md:hidden text-xs text-gray-400 block mb-1">รวม:</span>
                                            ฿{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">สรุปยอดคำสั่งซื้อ</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600">
                                    <span>ยอดรวมสินค้า</span>
                                    <span className="font-medium text-gray-800">฿{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>ภาษี (VAT 7%)</span>
                                    <span className="font-medium text-gray-800">฿{vat.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>ค่าจัดส่ง</span>
                                    <span className="font-medium text-gray-800">
                                        {shipping === 0 ? <span className="text-green-600 font-bold">ฟรี</span> : `฿${shipping}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-[11px] text-gray-400 text-right italic">
                                        * ส่งฟรีเมื่อซื้อครบ ฿5,000.00
                                    </p>
                                )}
                            </div>

                            <div className="pt-6 border-t mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-800 font-bold">ยอดสุทธิที่ต้องชำระ</span>
                                    <span className="text-3xl font-bold text-accent">฿{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/checkout")}
                                className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-[#d41a1a] transition-all shadow-lg shadow-accent/20 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                ดำเนินการต่อ
                                <AiOutlineArrowLeft className="rotate-180" />
                            </button>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <div className="bg-green-50 text-green-600 p-1 rounded-full">✓</div>
                                    <span>รับประกันสินค้าแท้ 100%</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <div className="bg-green-50 text-green-600 p-1 rounded-full">✓</div>
                                    <span>เปลี่ยนคืนสินค้าได้ภายใน 7 วัน</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
