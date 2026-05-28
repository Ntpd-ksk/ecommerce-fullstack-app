"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/front-end/Navbar";
import Cart from "@/components/front-end/Cart";
import Footer from "@/components/front-end/Footer";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AiFillStar, AiOutlineShoppingCart, AiOutlineHeart, AiFillHeart, AiOutlineShareAlt } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addToCart } from "@/redux/features/cartSlice";
import { toggleWishlistDb } from "@/redux/features/wishlistSlice";
import { makeToast } from "@/utils/helper";
import { useSession } from "next-auth/react";
import { openAuthModal } from "@/redux/features/authModalSlice";

interface IProduct {
    id: string;
    name: string;
    brand: string;
    sku: string;
    description: string;
    price: string;
    discountPrice: string;
    warranty: string;
    tags: string | string[];
    specs: any;
    imagePath: string;
}

const ProductDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCart, setShowCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useAppDispatch();
    const wishlist = useAppSelector((state) => state.wishlistReducer);
    const cartItems = useAppSelector((state) => state.cartReducer);
    const isWishlisted = product ? wishlist.some((item: any) => item.id === product.id) : false;
    const cartItem = product ? cartItems.find((item: any) => item.id === product.id) : null;

    useEffect(() => {
        if (id) {
            axios.get(`/api/product/${id}`)
                .then((res) => {
                    setProduct(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!session) {
            makeToast("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า");
            dispatch(openAuthModal());
            return;
        }
        if (product) {
            const payload = {
                id: product.id,
                img: product.imagePath,
                title: product.name,
                price: parseFloat(product.price),
                quantity: quantity,
            };
            dispatch(addToCart(payload));
            makeToast("เพิ่มสินค้าลงตะกร้าแล้ว");
        }
    };

    const handleBuyNow = () => {
        if (!session) {
            makeToast("กรุณาเข้าสู่ระบบก่อนสั่งซื้อสินค้า");
            dispatch(openAuthModal());
            return;
        }
        if (product) {
            const params = new URLSearchParams({
                productId: product.id,
                name: product.name,
                price: product.discountPrice || product.price,
                img: product.imagePath,
                qty: quantity.toString(),
            });
            router.push(`/checkout?${params.toString()}`);
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        makeToast("คัดลอกลิงค์แล้ว");
    };

    const handleToggleWishlist = () => {
        if (!session) {
            makeToast("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในรายการโปรด");
            dispatch(openAuthModal());
            return;
        }
        if (product) {
            dispatch(toggleWishlistDb(product));
            if (isWishlisted) {
                makeToast("นำออกจากรายการโปรดแล้ว");
            } else {
                makeToast("เพิ่มในรายการโปรดแล้ว");
            }
        }
    };

    if (loading) {
        return (
            <div className="grid place-items-center h-screen">
                <span className="loader"></span>
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-20">ไม่พบสินค้า</div>;
    }

    const tagsArray = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags;
    const specsObj = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;

    return (
        <main>
            <Navbar setShowCart={setShowCart} />
            {showCart && <Cart setShowCart={setShowCart} />}

            <div className="container mx-auto px-4 py-8">
                {/* Product Section */}
                <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-lg shadow-sm">
                    {/* Left: Image */}
                    <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden bg-[#f9f9f9] flex items-center justify-center min-h-[400px]">
                        <img
                            src={product.imagePath}
                            alt={product.name}
                            className="max-w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Right: Info */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#e6fffa] text-[#38b2ac] text-xs font-bold px-2 py-1 rounded">มีสินค้า</span>
                        </div>

                        <h1 className="text-2xl font-bold text-[#333] leading-tight">
                            {product.name}
                        </h1>

                        <div className="text-sm text-gray-500">
                            หมวดหมู่: <span className="text-accent font-medium">{product.category}</span> | แบรนด์: <span className="text-accent font-medium">{product.brand}</span> | รหัสสินค้า: {product.sku}
                        </div>

                        {product.description && (
                            <div className="text-gray-600 text-sm mt-2 line-clamp-3">
                                {product.description}
                            </div>
                        )}

                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={handleShare}
                                className="text-gray-400 hover:text-accent transition-colors"
                            >
                                <AiOutlineShareAlt size={24} />
                            </button>
                            <button
                                onClick={handleToggleWishlist}
                                className="transition-colors"
                            >
                                {isWishlisted ? (
                                    <AiFillHeart size={24} className="text-red-500" />
                                ) : (
                                    <AiOutlineHeart size={24} className="text-gray-400 hover:text-red-500" />
                                )}
                            </button>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-baseline gap-3">
                                {product.discountPrice ? (
                                    <>
                                        <span className="text-4xl font-bold text-accent">฿{parseFloat(product.discountPrice).toLocaleString()}</span>
                                        <span className="text-gray-400 line-through text-lg">฿{parseFloat(product.price).toLocaleString()}</span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-accent">฿{parseFloat(product.price).toLocaleString()}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <span className="text-gray-600 font-medium">จำนวน</span>
                            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-200 transition-colors"
                                >-</button>
                                <span className="px-6 py-2 font-bold">{quantity.toString().padStart(2, '0')}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-200 transition-colors"
                                >+</button>
                            </div>
                            {cartItem && (
                                <span className="text-sm text-gray-500">
                                    (ในตะกร้า: {cartItem.quantity})
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 border-2 border-accent text-accent font-bold py-3 rounded-md hover:bg-accent hover:text-white transition-all"
                            >
                                <AiOutlineShoppingCart size={20} />
                                เพิ่มในตะกร้า
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-accent text-white font-bold py-3 rounded-md hover:bg-[#d41a1a] transition-all"
                            >
                                ซื้อเลย
                            </button>
                        </div>
                    </div>
                </div>

                {/* Specs Section */}
                <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b">
                        <button className="px-8 py-4 font-bold text-accent border-b-2 border-accent">คุณสมบัติสินค้า</button>
                    </div>

                    <div className="p-6">
                        <table className="w-full text-sm">
                            <tbody>
                                {specsObj && Object.entries(specsObj).map(([key, value]: [string, any]) => (
                                    <tr key={key} className="border-b last:border-0">
                                        <td className="py-4 px-4 w-1/3 text-gray-600 font-medium bg-gray-50">{key}</td>
                                        <td className="py-4 px-4 w-2/3 text-gray-800">{value}</td>
                                    </tr>
                                ))}
                                <tr className="border-b last:border-0">
                                    <td className="py-4 px-4 w-1/3 text-gray-600 font-medium bg-gray-50">Warranty</td>
                                    <td className="py-4 px-4 w-2/3 text-gray-800">{product.warranty}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info Icons (Optional like in the image) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg">
                        <div className="bg-gray-100 p-2 rounded-full">🚚</div>
                        <div className="text-xs">
                            <p className="font-bold">ส่งฟรีทั่วไทย</p>
                            <p className="text-gray-500">เมื่อช้อปครบ 5,000 ขึ้นไป</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg">
                        <div className="bg-gray-100 p-2 rounded-full">🔄</div>
                        <div className="text-xs">
                            <p className="font-bold">เปลี่ยนคืนสินค้าง่าย</p>
                            <p className="text-gray-500">เปลี่ยนใหม่ภายใน 7 วัน</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg">
                        <div className="bg-gray-100 p-2 rounded-full">⏰</div>
                        <div className="text-xs">
                            <p className="font-bold">รวดเร็วในการให้บริการ</p>
                            <p className="text-gray-500">ตอบด่วน ตอบไว</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg">
                        <div className="bg-gray-100 p-2 rounded-full">🛡️</div>
                        <div className="text-xs">
                            <p className="font-bold">ชำระเงินปลอดภัย</p>
                            <p className="text-gray-500">ด้วยระบบออนไลน์</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default ProductDetail;
