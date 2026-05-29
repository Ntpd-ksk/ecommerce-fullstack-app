"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineUser, AiOutlineHome, AiOutlineCamera, AiOutlineEdit, AiOutlineDelete, AiOutlineCheck, AiOutlinePlus, AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart, AiOutlineFileText, AiOutlineDown, AiOutlineUp, AiOutlineCreditCard } from "react-icons/ai";
import Navbar from "@/components/front-end/Navbar";
import Footer from "@/components/front-end/Footer";
import Cart from "@/components/front-end/Cart";
import ProductCard from "@/components/front-end/ProductCard";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { removeFromWishlist } from "@/redux/features/wishlistSlice";

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

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imagePath: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  paymentMethod: string;
  trackingNumber: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "info");
  const wishlist = useAppSelector((state) => state.wishlistReducer);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const slipInputRef = useRef<HTMLInputElement>(null);

  const [addressFormData, setAddressFormData] = useState({
    name: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    isDefault: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    facebook: "",
    line: "",
    image: "",
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["info", "address", "wishlist", "orders"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const res = await axios.get("/api/user/me");
          const userData = res.data.user;
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            birthDate: userData.birthDate || "",
            facebook: userData.facebook || "",
            line: userData.line || "",
            image: userData.image || "",
          });
        } catch (error) {
          console.error("Fetch user error:", error);
        }
      }
    };
    fetchUserData();
    fetchAddresses();
    fetchOrders();
  }, [status, router, session]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("/api/address");
      setAddresses(res.data.addresses);
    } catch (error) {
      console.error("Fetch addresses error:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders");
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Fetch orders error:", error);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      PENDING: "รอชำระเงิน",
      PROCESSING: "กำลังดำเนินการ",
      VERIFYING: "กำลังตรวจสอบ",
      PAID: "ชำระเงินแล้ว",
      SHIPPING: "กำลังส่ง",
      SUCCESS: "สำเร็จ",
      CANCELLED: "ยกเลิกแล้ว",
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
      PROCESSING: "text-orange-600 bg-orange-50 border-orange-200",
      VERIFYING: "text-blue-600 bg-blue-50 border-blue-200",
      PAID: "text-green-600 bg-green-50 border-green-200",
      SHIPPING: "text-purple-600 bg-purple-50 border-purple-200",
      SUCCESS: "text-gray-600 bg-gray-50 border-gray-200",
      CANCELLED: "text-red-600 bg-red-50 border-red-200",
    };
    return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  const handleOpenPayment = (order: Order) => {
    setSelectedOrder(order);
    setSlipImage(null);
    setIsPaymentModalOpen(true);
  };

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSlip = async () => {
    if (!selectedOrder || !slipImage) return;
    setLoading(true);
    try {
      await axios.post(`/api/orders/${selectedOrder.id}/upload-slip`, {
        paymentSlip: slipImage,
      });
      toast.success("ส่งหลักฐานการชำระเงินสำเร็จ");
      setIsPaymentModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการส่งหลักฐาน");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/user/update", formData);
      await update({
        user: {
          name: formData.name,
          image: formData.image,
        },
      });
      setIsEditing(false);
      toast.success("บันทึกข้อมูลสำเร็จ");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAddress) {
        await axios.put(`/api/address/${editingAddress.id}`, addressFormData);
        toast.success("แก้ไขที่อยู่สำเร็จ");
      } else {
        await axios.post("/api/address", addressFormData);
        toast.success("เพิ่มที่อยู่สำเร็จ");
      }
      setIsAddressModalOpen(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("ยืนยันการลบที่อยู่นี้?")) return;
    try {
      await axios.delete(`/api/address/${id}`);
      toast.success("ลบที่อยู่สำเร็จ");
      fetchAddresses();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const address = addresses.find((a) => a.id === id);
      if (address) {
        await axios.put(`/api/address/${id}`, { ...address, isDefault: true });
        toast.success("ตั้งค่าที่อยู่เริ่มต้นสำเร็จ");
        fetchAddresses();
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressFormData({
      name: "",
      phone: "",
      address: "",
      province: "",
      district: "",
      subDistrict: "",
      postalCode: "",
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      province: address.province,
      district: address.district,
      subDistrict: address.subDistrict,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400; // Resize to max 400px
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // Compress 70%
          setFormData({ ...formData, image: dataUrl });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <main>
      <Navbar setShowCart={setShowCart} />
      {showCart && <Cart setShowCart={setShowCart} />}

      <div className="bg-[#EBEDF6] min-h-screen py-8">
        <div className="container flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold overflow-hidden">
                  {formData.image ? (
                    <img src={formData.image} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(session.user?.email)
                  )}
                </div>
                <div>
                  <p className="font-bold truncate max-w-[150px]">{formData.name || "ผู้ใช้งาน"}</p>
                  <button onClick={() => setIsEditing(true)} className="text-sm text-gray-500 hover:text-accent">
                    แก้ไขโปรไฟล์
                  </button>
                </div>
              </div>

              <nav className="space-y-4">
                <div className="space-y-2">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">รายการ</p>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      activeTab === "orders" ? "bg-accent text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <AiOutlineFileText /> คำสั่งซื้อของฉัน
                  </button>
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      activeTab === "wishlist" ? "bg-accent text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <AiOutlineHeart /> รายการสินค้าโปรด
                    {wishlist.length > 0 && (
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        activeTab === "wishlist" ? "bg-white/20" : "bg-accent/10 text-accent"
                      }`}>{wishlist.length}</span>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">บัญชี</p>
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      activeTab === "info" ? "bg-accent text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <AiOutlineUser /> ข้อมูลส่วนตัว
                  </button>
                  <button
                    onClick={() => setActiveTab("address")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      activeTab === "address" ? "bg-accent text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <AiOutlineHome /> ที่อยู่ในการจัดส่ง
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">คำสั่งซื้อของฉัน</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <AiOutlineFileText size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">คุณยังไม่มีประวัติการสั่งซื้อ</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div
                            className="bg-gray-50 p-4 md:p-6 cursor-pointer flex flex-wrap items-center justify-between gap-4"
                            onClick={() => toggleOrderExpand(order.id)}
                          >
                            <div className="flex-1 min-w-[200px]">
                              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">หมายเลขคำสั่งซื้อ</p>
                              <p className="font-bold text-gray-800">#{order.id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="w-32">
                              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">ยอดรวม</p>
                              <p className="font-bold text-accent">฿{Number(order.total).toLocaleString()}</p>
                            </div>
                            <div className="w-32">
                              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">สถานะ</p>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {expandedOrders.includes(order.id) ? <AiOutlineUp /> : <AiOutlineDown />}
                            </div>
                          </div>

                          {expandedOrders.includes(order.id) && (
                            <div className="p-6 bg-white border-t animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">รายละเอียดการชำระเงิน</h3>
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium flex items-center gap-2">
                                      <AiOutlineCreditCard /> ช่องทาง:
                                      <span className="font-bold">
                                        {order.paymentMethod === 'bank' && '🏦 โอนผ่านบัญชีธนาคาร'}
                                        {order.paymentMethod === 'promptpay' && '📱 พร้อมเพย์ (PromptPay)'}
                                        {order.paymentMethod === 'cod' && '🚚 ชำระเงินปลายทาง'}
                                      </span>
                                    </p>
                                    {order.status === 'PENDING' && order.paymentMethod !== 'cod' && (
                                      <button
                                        onClick={() => handleOpenPayment(order)}
                                        className="mt-3 w-full bg-accent text-white py-2 rounded-lg text-sm font-bold hover:bg-[#d41a1a] transition-all"
                                      >
                                        ชำระเงิน / แนบสลิป
                                      </button>
                                    )}
                                    {(order.status === 'PENDING' || order.status === 'PROCESSING') && order.paymentMethod === 'cod' && (
                                      <p className="mt-2 text-xs text-orange-600 font-medium italic">รอรับสินค้าและชำระเงินปลายทาง</p>
                                    )}
                                    {order.status === 'VERIFYING' && (
                                      <p className="mt-2 text-xs text-blue-600 font-medium">รอตรวจสอบหลักฐานการชำระเงิน...</p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">ข้อมูลการจัดส่ง</h3>
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium">เลขพัสดุ: <span className="font-bold text-accent">{order.trackingNumber || 'รอดำเนินการ'}</span></p>
                                    <p className="text-xs text-gray-500 mt-1 italic">วันเวลาที่สั่งซื้อ: {new Date(order.createdAt).toLocaleString('th-TH')}</p>
                                  </div>
                                </div>
                              </div>

                              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">รายการสินค้า</h3>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex gap-4 p-3 border rounded-lg hover:border-accent/30 transition-colors">
                                    <img src={item.product.imagePath} alt={item.product.name} className="w-16 h-16 object-contain bg-gray-50 rounded" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-sm truncate">{item.product.name}</p>
                                      <p className="text-xs text-gray-500">จำนวน: {item.quantity}</p>
                                      <p className="text-sm font-bold text-accent">฿{Number(item.price).toLocaleString()}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {(() => {
                                const subtotal = order.items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
                                const vat = subtotal * 0.07;
                                const shipping = subtotal > 5000 ? 0 : 50;
                                return (
                                  <div className="mt-6 border-t pt-4 space-y-2">
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
                                      <span className="text-xl font-bold text-accent">฿{Number(order.total).toLocaleString()}</span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "info" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">ข้อมูลส่วนตัว</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded font-bold hover:opacity-90 transition-opacity"
                      >
                        <AiOutlineEdit /> แก้ไขข้อมูลส่วนตัว
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer" onClick={() => isEditing && fileInputRef.current?.click()}>
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400 overflow-hidden border-4 border-white shadow-md">
                        {formData.image ? (
                          <img src={formData.image} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(session.user?.email)
                        )}
                      </div>
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                          <AiOutlineCamera size={24} />
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    {isEditing && <p className="mt-2 text-sm text-gray-500">กดเพื่อเปลี่ยนรูปโปรไฟล์</p>}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ชื่อ-นามสกุล</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">อีเมล (ไม่สามารถแก้ไขได้)</label>
                        <input
                          type="email"
                          className="w-full border border-gray-200 p-2 rounded bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                          value={formData.email}
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">เบอร์โทรศัพท์</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="08X-XXX-XXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">วันเกิด</label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Facebook</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                          value={formData.facebook}
                          onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                          placeholder="Facebook URL / Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Line</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                          value={formData.line}
                          onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                          placeholder="Line ID"
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-accent text-white px-8 py-2 rounded font-bold hover:opacity-90 disabled:bg-gray-400"
                        >
                          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => setIsEditing(false)}
                          className="border border-gray-300 px-8 py-2 rounded font-bold hover:bg-gray-50 disabled:bg-gray-100"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mt-4">
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500 mb-1">ชื่อ-นามสกุล</p>
                        <p className="font-bold">{formData.name || "-"}</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500 mb-1">อีเมล</p>
                        <p className="font-bold text-gray-400">{formData.email}</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500 mb-1">เบอร์โทรศัพท์</p>
                        <p className="font-bold">{formData.phone || "-"}</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500 mb-1">วันเกิด</p>
                        <p className="font-bold">{formData.birthDate || "-"}</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500 mb-1">Facebook</p>
                        <p className="font-bold">{formData.facebook || "-"}</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500 mb-1">Line</p>
                        <p className="font-bold">{formData.line || "-"}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "address" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">ที่อยู่ในการจัดส่ง</h2>
                    <button
                      onClick={openAddAddress}
                      className="bg-accent text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90 flex items-center gap-2"
                    >
                      <AiOutlinePlus /> เพิ่มที่อยู่ใหม่
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center text-gray-400">
                      <AiOutlineHome size={48} className="mx-auto mb-4" />
                      <p>คุณยังไม่มีข้อมูลที่อยู่</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-6 relative transition-all ${
                            address.isDefault ? "border-accent ring-1 ring-accent" : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <p className="font-bold text-lg">{address.name}</p>
                                {address.isDefault && (
                                  <span className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded border border-accent/20">
                                    ที่อยู่เริ่มต้น
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600">{address.phone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditAddress(address)}
                                className="p-2 text-gray-400 hover:text-accent hover:bg-gray-50 rounded-full transition-colors"
                                title="แก้ไข"
                              >
                                <AiOutlineEdit size={20} />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="ลบ"
                              >
                                <AiOutlineDelete size={20} />
                              </button>
                            </div>
                          </div>
                          <div className="text-gray-600 space-y-1">
                            <p>{address.address}</p>
                            <p>
                              {address.subDistrict}, {address.district}, {address.province}, {address.postalCode}
                            </p>
                          </div>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="mt-4 text-sm text-accent hover:underline flex items-center gap-1 font-medium"
                            >
                              ตั้งเป็นที่อยู่เริ่มต้น
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <AiFillHeart size={28} className="text-red-500" />
                    <h2 className="text-2xl font-bold">รายการสินค้าโปรด</h2>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-16 text-center text-gray-400">
                      <AiOutlineHeart size={64} className="mx-auto mb-4 opacity-20" />
                      <p className="text-lg">คุณยังไม่มีรายการสินค้าโปรด</p>
                      <button
                        onClick={() => router.push("/")}
                        className="mt-4 text-accent hover:underline font-medium"
                      >
                        ไปเลือกช้อปสินค้าเลย
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((product: any) => (
                        <div key={product.id} className="relative group">
                          <ProductCard
                            id={product.id}
                            img={product.imagePath}
                            category={product.brand}
                            title={product.name}
                            price={parseFloat(product.price)}
                            discountPrice={product.discountPrice ? parseFloat(product.discountPrice) : undefined}
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              dispatch(removeFromWishlist(product.id));
                              toast.success("นำออกจากรายการโปรดแล้ว");
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-[5]"
                            title="นำออกจากรายการโปรด"
                          >
                            <AiOutlineDelete size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold">{editingAddress ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}</h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleAddressSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">ชื่อ-นามสกุล ผู้รับ</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                    value={addressFormData.name}
                    onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                    value={addressFormData.phone}
                    onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium">ที่อยู่ (บ้านเลขที่, ถนน, ซอย)</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                    value={addressFormData.address}
                    onChange={(e) => setAddressFormData({ ...addressFormData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">แขวง / ตำบล</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                    value={addressFormData.subDistrict}
                    onChange={(e) => setAddressFormData({ ...addressFormData, subDistrict: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">เขต / อำเภอ</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                    value={addressFormData.district}
                    onChange={(e) => setAddressFormData({ ...addressFormData, district: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">จังหวัด</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                    value={addressFormData.province}
                    onChange={(e) => setAddressFormData({ ...addressFormData, province: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:border-accent outline-none"
                    value={addressFormData.postalCode}
                    onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    checked={addressFormData.isDefault}
                    onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-accent"
                  />
                  <label className="text-sm font-medium">ตั้งเป็นที่อยู่เริ่มต้น</label>
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent text-white px-8 py-2 rounded font-bold hover:opacity-90 disabled:bg-gray-400"
                >
                  {loading ? "กำลังบันทึก..." : editingAddress ? "บันทึกการแก้ไข" : "เพิ่มที่อยู่"}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsAddressModalOpen(false)}
                  className="border border-gray-300 px-8 py-2 rounded font-bold hover:bg-gray-50 disabled:bg-gray-100"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold">ช่องทางการชำระเงิน</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-8 text-center">
              <div className="mb-6">
                <p className="text-gray-500 mb-1">ยอดชำระทั้งหมด</p>
                <p className="text-3xl font-bold text-accent">฿{Number(selectedOrder.total).toLocaleString()}</p>
              </div>

              <div className="p-6 border-2 border-accent/20 bg-accent/5 rounded-xl mb-8">
                {selectedOrder.paymentMethod === 'bank' && (
                  <div>
                    <p className="text-2xl mb-2">🏦</p>
                    <p className="font-bold text-lg mb-4 text-gray-800">โอนผ่านบัญชีธนาคาร</p>
                    <div className="space-y-2 text-sm text-gray-600 bg-white p-4 rounded-lg border border-accent/10">
                      <p>ธนาคารกสิกรไทย (K-Bank)</p>
                      <p className="font-bold text-gray-800 text-lg">123-4-56789-0</p>
                      <p>ชื่อบัญชี: บจก. อีคอมเมิร์ซ ฟูลสแตค</p>
                    </div>
                  </div>
                )}
                {selectedOrder.paymentMethod === 'promptpay' && (
                  <div>
                    <div className="flex justify-center mb-4">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
                        alt="PromptPay Logo"
                        className="h-8 object-contain"
                      />
                    </div>
                    <p className="font-bold text-lg mb-4 text-gray-800">พร้อมเพย์ (PromptPay)</p>
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-xl border border-accent/10 mb-4 shadow-sm relative">
                        {/* Mock QR Code */}
                        <div className="w-48 h-48 bg-white flex items-center justify-center border-2 border-gray-100">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0812345678&color=003b6a`}
                            alt="QR Code PromptPay"
                            className="w-full h-full p-1"
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-white p-1 rounded-md shadow-sm border">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" className="h-3 w-auto" alt="pp" />
                            </div>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mb-1">หมายเลขพร้อมเพย์</p>
                      <p className="font-bold text-gray-800 text-2xl tracking-wider">081-234-5678</p>
                      <p className="text-gray-400 text-xs mt-1">ชื่อบัญชี: บจก. อีคอมเมิร์ซ ฟูลสแตค</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mb-6 italic">* เมื่อโอนเงินแล้ว กรุณาแจ้งหลักฐานการโอนเงิน (Slip) ในระบบ</p>

              <div className="mb-6">
                <input
                  type="file"
                  ref={slipInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleSlipChange}
                />
                {slipImage ? (
                  <div className="relative inline-block">
                    <img src={slipImage} alt="slip" className="w-full max-w-[200px] h-auto rounded-lg border shadow-sm mx-auto" />
                    <button
                      onClick={() => setSlipImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => slipInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 py-4 rounded-xl text-gray-500 hover:border-accent hover:text-accent transition-all flex flex-col items-center gap-2"
                  >
                    <AiOutlineCamera size={24} />
                    <span>แนบหลักฐานการโอนเงิน</span>
                  </button>
                )}
              </div>

              <button
                onClick={handleSubmitSlip}
                disabled={loading || !slipImage}
                className="w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-[#d41a1a] transition-all disabled:bg-gray-400"
              >
                {loading ? "กำลังส่ง..." : "ยืนยันการแจ้งชำระเงิน"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

function getInitials(email: string | null | undefined) {
  if (!email) return "U";
  return email.slice(0, 2).toUpperCase();
}
