// Component Navbar เป็นส่วนหนึ่งของหน้าเว็บที่แสดงเมนูและเครื่องมือต่างๆ ซึ่งมักจะประกอบด้วยโลโก้เว็บไซต์ ช่องค้นหา รายการสินค้าในตะกร้า และลิงก์เข้าสู่ระบบของผู้ใช้

import { useAppSelector, useAppDispatch } from '@/redux/hook'
import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from 'react'
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart } from 'react-icons/ai'
import { BsSearch } from 'react-icons/bs'
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { openAuthModal, closeAuthModal } from "@/redux/features/authModalSlice";

interface PropsType {
    setShowCart: Dispatch<SetStateAction<boolean>>;
    setSearchQuery?: Dispatch<SetStateAction<string>>;
    scrollToProducts?: () => void;
}

const Navbar = ({ setShowCart, setSearchQuery, scrollToProducts }: PropsType) => {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const cartCount = useAppSelector((state) => state.cartReducer.length)
    const wishlistCount = useAppSelector((state) => state.wishlistReducer.length)
    const isAuthModalOpen = useAppSelector((state) => state.authModalReducer.isOpen)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchValue.trim().length > 0) {
            axios.get("/api/get_products").then(res => {
                const filtered = res.data.filter((p: any) =>
                    p.name.toLowerCase().includes(searchValue.toLowerCase())
                ).slice(0, 5);
                setSuggestions(filtered);
                setShowSuggestions(true);
            }).catch(() => {});
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchValue]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (setSearchQuery) {
            setSearchQuery(searchValue);
        }
        setShowSuggestions(false);
        if (scrollToProducts) {
            scrollToProducts();
        }
    };

    useEffect(() => {
        if (session) {
            axios.get("/api/user/me").then(res => {
                setUserImage(res.data.user.image);
            }).catch(() => {});
        } else {
            setUserImage(null);
        }
    }, [session]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (email: string | null | undefined) => {
        if (!email) return "U";
        return email.slice(0, 2).toUpperCase();
    };

    const handleProfileClick = () => {
        if (!session) {
            dispatch(openAuthModal());
        } else {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    const handleCartClick = () => {
        if (!session) {
            dispatch(openAuthModal());
        } else {
            setShowCart(true);
        }
    };

    return (
        <div className='pt-4 bg-white/95 backdrop-blur-md top-0 sticky z-50 shadow-sm'>
            <div className="container">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-3xl font-heading tracking-tight flex items-center group">
                        <span className="text-secondary group-hover:text-primary transition-colors duration-300">NATAPOD</span>
                        <span className="bg-primary text-white px-2 py-0.5 rounded ml-1 skew-x-[-12deg] group-hover:shadow-[0_0_15px_rgba(229,57,53,0.4)] transition-all duration-300">GEAR</span>
                    </Link>
                    <div className='lg:flex hidden w-full max-w-[520px] relative group' ref={searchRef}>
                        <form onSubmit={handleSearch} className="flex w-full relative">
                            <div className="relative flex w-full items-center rounded-full border-2 border-gray-200 bg-gray-50/80 transition-all duration-300 focus-within:border-primary focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(229,57,53,0.12)] overflow-hidden">
                                <input className='pl-6 pr-4 py-2.5 w-full bg-transparent outline-none text-sm text-secondary placeholder:text-gray-400 transition-colors duration-200'
                                    type="text"
                                    placeholder='ค้นหาสินค้าเลย'
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onFocus={() => searchValue.trim().length > 0 && setShowSuggestions(true)}
                                />
                                {searchValue && (
                                    <button
                                        type="button"
                                        className="mr-3 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
                                        onClick={() => { setSearchValue(""); setSuggestions([]); setShowSuggestions(false); }}
                                    >
                                        &times;
                                    </button>
                                )}
                                <button type="submit" className='bg-primary text-white text-lg grid place-items-center h-full px-6 hover:bg-primary-700 active:opacity-90 transition-all duration-200 cursor-pointer'>
                                    <BsSearch />
                                </button>
                            </div>
                        </form>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full mt-2 left-2 right-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                                {suggestions.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        className="flex items-center gap-4 px-5 py-3 hover:bg-primary-50 border-b border-gray-50 last:border-none transition-colors cursor-pointer"
                                        onClick={() => setShowSuggestions(false)}
                                    >
                                        <img src={product.imagePath} alt="" className="w-10 h-10 object-contain bg-gray-50 p-1 rounded-lg" />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-sm font-medium text-secondary line-clamp-1">{product.name}</span>
                                            <span className="text-xs text-primary font-bold">฿{(product.discountPrice || product.price).toLocaleString()}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className='flex gap-4 md:gap-8 items-center'>
                        <div className='relative' ref={dropdownRef}>
                            <div className='rounded-full border-2 border-gray-300 text-gray-500 text-[24px] w-[50px] h-[50px] grid place-items-center hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden font-bold' onClick={handleProfileClick}>
                                {session ? (
                                    userImage ? (
                                        <img src={userImage} alt="user" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm">{getInitials(session.user?.email)}</span>
                                    )
                                ) : (
                                    <AiOutlineUser />
                                )}
                            </div>

                            {isDropdownOpen && session && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                        <p className="text-xs text-gray-400">เข้าสู่ระบบในฐานะ</p>
                                        <p className="text-sm font-semibold truncate">{session.user?.email}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${session.user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {session.user?.role}
                                        </span>
                                    </div>

                                    {session.user?.role === "ADMIN" && (
                                        <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-50" onClick={() => setIsDropdownOpen(false)}>Admin Dashboard</Link>
                                    )}

                                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>บัญชีของฉัน</Link>
                                    <Link href="/profile?tab=wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>รายการสินค้าโปรด</Link>
                                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100 mt-1">ออกจากระบบ</button>
                                </div>
                            )}
                        </div>
                        <div
                            className='relative cursor-pointer'
                            onClick={handleCartClick}
                        >
                            <div className='rounded-full border-2 border-gray-300 text-gray-500 text-[28px] w-[50px] h-[50px] grid place-items-center hover:bg-gray-50 transition-colors'>
                                <AiOutlineShoppingCart />
                            </div>

                            {session && cartCount > 0 && (
                                <div className='absolute top-[-5px] right-[-5px] bg-red-600 w-[22px] h-[22px]
                                 rounded-full text-white text-[12px] grid place-items-center font-bold'>
                                    {cartCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='border-b border-gray-200 pt-4' />
            </div>
        </div>
    )
}

export default Navbar