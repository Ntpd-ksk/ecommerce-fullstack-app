"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineUser, AiOutlineHome, AiOutlineCamera, AiOutlineEdit, AiOutlineDelete, AiOutlineCheck, AiOutlinePlus, AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
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
    if (tab && ["info", "address", "wishlist"].includes(tab)) {
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
  }, [status, router, session]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("/api/address");
      setAddresses(res.data.addresses);
    } catch (error) {
      console.error("Fetch addresses error:", error);
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
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold">{editingAddress ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}</h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl p-1"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddressSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">ชื่อ-นามสกุล</label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    value={addressFormData.name}
                    onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">เบอร์โทรศัพท์</label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    value={addressFormData.phone}
                    onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">ที่อยู่ (บ้านเลขที่, ถนน, ซอย)</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none"
                    value={addressFormData.address}
                    onChange={(e) => setAddressFormData({ ...addressFormData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">แขวง/ตำบล</label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    value={addressFormData.subDistrict}
                    onChange={(e) => setAddressFormData({ ...addressFormData, subDistrict: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">เขต/อำเภอ</label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    value={addressFormData.district}
                    onChange={(e) => setAddressFormData({ ...addressFormData, district: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">จังหวัด</label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    value={addressFormData.province}
                    onChange={(e) => setAddressFormData({ ...addressFormData, province: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">รหัสไปรษณีย์</label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    value={addressFormData.postalCode}
                    onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent cursor-pointer"
                    checked={addressFormData.isDefault}
                    onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    ตั้งเป็นที่อยู่เริ่มต้น
                  </label>
                </div>
              </div>
              <div className="flex gap-4 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-accent text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] transition-all disabled:bg-gray-400"
                >
                  {loading ? "กำลังดำเนินการ..." : editingAddress ? "บันทึกการแก้ไข" : "เพิ่มที่อยู่"}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 border border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50 active:scale-[0.98] transition-all disabled:bg-gray-100"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
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
