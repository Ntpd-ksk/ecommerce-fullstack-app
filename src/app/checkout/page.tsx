"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineArrowLeft, AiOutlineHome, AiOutlineCheck, AiOutlineWarning } from "react-icons/ai";
import Navbar from "@/components/front-end/Navbar";
import Footer from "@/components/front-end/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hook";

interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    subDistrict: string;
    postalCode: string;
    isDefault: boolean;
}

interface CartItem {
    id: string;
    title: string;
    img: string;
    price: number;
    quantity: number;
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>}>
            <Navbar />
            <CheckoutContent />
            <Footer />
        </Suspense>
    );
}

function CheckoutContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [isOrdered, setIsOrdered] = useState(false);

    const productId = searchParams.get("productId");
    const productName = searchParams.get("name");
    const productPrice = searchParams.get("price");
    const productImg = searchParams.get("img");
    const productQty = searchParams.get("qty") || "1";

    const buyNowItem: CartItem | null = productId ? {
        id: productId,
        title: productName || "สินค้า",
        price: parseFloat(productPrice || "0"),
        img: productImg || "",
        quantity: parseInt(productQty)
    } : null;

    const cartItems = useAppSelector((state) => state.cartReducer);
    const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
            return;
        }
        fetchAddresses();
    }, [status]);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get("/api/address");
            const fetchedAddresses = res.data.addresses;
            setAddresses(fetchedAddresses);
            const defaultAddr = fetchedAddresses.find((a: Address) => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            } else if (fetchedAddresses.length > 0) {
                setSelectedAddressId(fetchedAddresses[0].id);
            }
        } catch (error) {
            console.error("Fetch addresses error:", error);
        }
    };

    const subtotal = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const vat = subtotal * 0.07;
    const shipping = subtotal > 5000 || checkoutItems.length === 0 ? 0 : 50;
    const total = subtotal + vat + shipping;

    const handleConfirmOrder = async () => {
        if (!selectedAddressId) {
            toast.error("กรุณาเลือกที่อยู่จัดส่ง", { icon: <AiOutlineWarning className="text-yellow-500" /> });
            return;
        }
        if (!paymentMethod) {
            toast.error("กรุณาเลือกช่องทางการชำระเงิน", { icon: <AiOutlineWarning className="text-yellow-500" /> });
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("/api/orders", {
                items: checkoutItems,
                total: total,
                paymentMethod: paymentMethod
            });

            if (res.data.order) {
                setIsOrdered(true);
                toast.success("ยืนยันคำสั่งซื้อสำเร็จ");
            }
        } catch (error: any) {
            console.error("Checkout error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            toast.success("แจ้งชำระเงินสำเร็จ!");
            setTimeout(() => {
                router.push("/profile?tab=orders");
            }, 1500);
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    if (checkoutItems.length === 0 && !isOrdered) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">ไม่มีสินค้าสำหรับการสั่งซื้อ</h2>
                <button onClick={() => router.push("/")} className="text-accent hover:underline">กลับไปเลือกซื้อสินค้า</button>
            </div>
        );
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);

    return (
        <div className="bg-[#f5f7f9] min-h-screen pb-12">
            <div className="container mx-auto px-4 py-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-accent mb-6 transition-colors">
                    <AiOutlineArrowLeft /> กลับ
                </button>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-[2] space-y-6">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                                <h2 className="font-bold text-lg flex items-center gap-3">
                                    <span className="bg-accent text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                                    ที่อยู่ในการจัดส่ง
                                </h2>
                                <button onClick={() => router.push("/profile?tab=address")} className="text-accent text-sm hover:underline">จัดการที่อยู่</button>
                            </div>
                            <div className="p-6">
                                {addresses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">ยังไม่มีข้อมูลที่อยู่</p>
                                        <button onClick={() => router.push("/profile?tab=address")} className="bg-accent text-white px-6 py-2 rounded-lg font-bold">เพิ่มที่อยู่</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                onClick={() => !isOrdered && setSelectedAddressId(address.id)}
                                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all relative ${
                                                    selectedAddressId === address.id ? "border-accent bg-accent/5" : "border-gray-100 hover:border-gray-200"
                                                } ${isOrdered && selectedAddressId !== address.id ? "opacity-50 pointer-events-none" : ""}`}
                                            >
                                                {selectedAddressId === address.id && (
                                                    <AiOutlineCheck className="absolute top-3 right-3 text-accent" size={20} />
                                                )}
                                                <p className="font-bold mb-1">{address.name}</p>
                                                <p className="text-sm text-gray-600 mb-2">{address.phone}</p>
                                                <p className="text-sm text-gray-500 leading-relaxed">
                                                    {address.address} {address.subDistrict} {address.district} {address.province} {address.postalCode}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <h2 className="font-bold text-lg flex items-center gap-3">
                                    <span className="bg-accent text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                                    ช่องทางการชำระเงิน
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {[
                                        { id: "bank", label: "โอนเงินผ่านบัญชีธนาคาร", icon: "🏦" },
                                        { id: "promptpay", label: "พร้อมเพย์ (PromptPay)", icon: "📱" },
                                        { id: "cod", label: "ชำระเงินปลายทาง", icon: "🚚" }
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                paymentMethod === method.id ? "border-accent bg-accent/5" : "border-gray-100 hover:border-gray-200"
                                            } ${isOrdered && paymentMethod !== method.id ? "hidden" : ""}`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="w-5 h-5 accent-accent"
                                                checked={paymentMethod === method.id}
                                                onChange={() => setPaymentMethod(method.id)}
                                                disabled={isOrdered}
                                            />
                                            <span className="text-2xl">{method.icon}</span>
                                            <span className="font-medium text-gray-700">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {isOrdered && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-200 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3 text-green-700 font-bold">
                                    <AiOutlineCheck size={24} /> ยืนยันข้อมูลการสั่งซื้อสำเร็จ
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">ที่อยู่จัดส่ง</h3>
                                        {selectedAddress && (
                                            <div className="text-gray-700">
                                                <p className="font-bold">{selectedAddress.name}</p>
                                                <p>{selectedAddress.phone}</p>
                                                <p>{selectedAddress.address}</p>
                                                <p>{selectedAddress.subDistrict}, {selectedAddress.district}</p>
                                                <p>{selectedAddress.province}, {selectedAddress.postalCode}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">ช่องทางชำระเงิน</h3>
                                        <p className="font-bold text-lg text-gray-700">
                                            {paymentMethod === 'bank' && '🏦 โอนเงินผ่านบัญชีธนาคาร'}
                                            {paymentMethod === 'promptpay' && '📱 พร้อมเพย์ (PromptPay)'}
                                            {paymentMethod === 'cod' && '🚚 ชำระเงินปลายทาง'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 sticky top-24 overflow-hidden">
                            <div className="p-6 border-b bg-gray-50">
                                <h2 className="font-bold text-lg">สรุปรายการสั่งซื้อ</h2>
                            </div>
                            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                                {checkoutItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center pb-4 border-b last:border-0">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border flex-shrink-0">
                                            <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold truncate">{item.title}</h3>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-xs text-gray-500">จำนวน: {item.quantity}</p>
                                                <p className="text-sm font-bold text-accent">฿{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-gray-50 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>ราคารวมสินค้า</span>
                                    <span>฿{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>ภาษี (VAT 7%)</span>
                                    <span>฿{vat.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>ค่าจัดส่ง</span>
                                    <span>{shipping === 0 ? <span className="text-green-600 font-bold">ฟรี</span> : `฿${shipping}`}</span>
                                </div>
                                <div className="pt-3 border-t flex justify-between items-end">
                                    <span className="font-bold text-gray-800">ราคาสุทธิ</span>
                                    <span className="text-2xl font-bold text-accent">฿{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="pt-6">
                                    {!isOrdered ? (
                                        <button
                                            onClick={handleConfirmOrder}
                                            disabled={loading}
                                            className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-[#d41a1a] transition-all shadow-lg shadow-accent/20 active:scale-[0.98] disabled:bg-gray-400"
                                        >
                                            {loading ? "กำลังดำเนินการ..." : "ยืนยันการสั่งซื้อ"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-[0.98] disabled:bg-gray-400"
                                        >
                                            {loading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
