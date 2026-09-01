"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft, AiOutlineDelete, AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart } from "react-icons/ai";
import Navbar from "@/components/front-end/Navbar";
import Footer from "@/components/front-end/Footer";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { removeFromCart, updateQuantity, clearCart } from "@/redux/features/cartSlice";
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
            <main className="bg-[#f5f7f9] min-h-screen flex flex-col">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center flex-1 flex items-center justify-center">
                    <div className="bg-white p-12 rounded-2xl shadow-sm inline-block max-w-md w-full">
                        <AiOutlineShoppingCart size={80} className="mx-auto text-gray-200 mb-6" />
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">ตะกร้าของคุณว่างเปล่า</h2>
                        <p className="text-gray-500 mb-8">ยังไม่มีสินค้าในตะกร้า ไปเลือกช้อปอุปกรณ์ฮาร์ดแวร์กันเถอะ</p>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full bg-accent text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#d41a1a] transition-all shadow-md shadow-accent/20"
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
        <main className="bg-[#f5f7f9] min-h-screen flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <AiOutlineShoppingCart className="text-accent" />
                        ตะกร้าสินค้า ({products.length} รายการ)
                    </h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (window.confirm("คุณต้องการลบสินค้าทั้งหมดออกจากตะกร้าใช่หรือไม่?")) {
                                    dispatch(clearCart());
                                }
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors border border-red-200"
                        >
                            <AiOutlineDelete size={16} /> ล้างตะกร้าทั้งหมด
                        </button>
                        <button onClick={() => router.push("/")} className="text-gray-600 hover:text-accent flex items-center gap-2 font-medium text-sm">
                            <AiOutlineArrowLeft /> เลือกซื้อสินค้าเพิ่ม
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Items List */}
                    <div className="flex-[2] space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b text-sm font-bold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-5">สินค้า</div>
                                <div className="col-span-2 text-center">ราคา</div>
                                <div className="col-span-2 text-center">จำนวน</div>
                                <div className="col-span-2 text-right">ราคารวม</div>
                                <div className="col-span-1 text-center">ลบ</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {products.map((item) => (
                                    <div key={item.id} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group hover:bg-gray-50/50 transition-colors">
                                        {/* Product Info */}
                                        <div className="md:col-span-5 flex gap-4 items-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-xl border flex-shrink-0 p-2 flex items-center justify-center">
                                                <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-gray-800 line-clamp-2 hover:text-accent transition-colors cursor-pointer text-sm md:text-base" onClick={() => router.push(`/product/${item.id}`)}>{item.title}</h3>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="md:col-span-2 text-left md:text-center font-medium text-gray-600">
                                            <span className="md:hidden text-xs text-gray-400 block mb-1">ราคา:</span>
                                            ฿{item.price.toLocaleString()}
                                        </div>

                                        {/* Quantity */}
                                        <div className="md:col-span-2 flex justify-start md:justify-center">
                                            <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity > 1) {
                                                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
                                                        } else {
                                                            if (window.confirm(`คุณต้องการลบ ${item.title} ออกจากตะกร้าใช่หรือไม่?`)) {
                                                                dispatch(removeFromCart(item.id));
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-gray-200 transition-colors text-gray-500 hover:text-red-500"
                                                    title={item.quantity === 1 ? "ลบสินค้า" : "ลดจำนวน"}
                                                >
                                                    {item.quantity === 1 ? <AiOutlineDelete size={14} className="text-red-500" /> : <AiOutlineMinus size={14} />}
                                                </button>
                                                <span className="w-10 text-center font-bold text-gray-800 text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                    className="p-2 hover:bg-gray-200 transition-colors text-gray-500 hover:text-accent"
                                                    title="เพิ่มจำนวน"
                                                >
                                                    <AiOutlinePlus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Line Total */}
                                        <div className="md:col-span-2 text-left md:text-right font-bold text-accent text-base md:text-lg">
                                            <span className="md:hidden text-xs text-gray-400 block mb-1">รวม:</span>
                                            ฿{(item.price * item.quantity).toLocaleString()}
                                        </div>

                                        {/* Delete Button */}
                                        <div className="md:col-span-1 flex justify-end md:justify-center">
                                            <button
                                                onClick={() => dispatch(removeFromCart(item.id))}
                                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
                                                title="ลบสินค้านี้ออกจากตะกร้า"
                                            >
                                                <AiOutlineDelete size={18} />
                                                <span className="md:hidden">ลบสินค้านี้</span>
                                            </button>
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
