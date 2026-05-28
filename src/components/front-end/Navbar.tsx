// Component Navbar เป็นส่วนหนึ่งของหน้าเว็บที่แสดงเมนูและเครื่องมือต่างๆ ซึ่งมักจะประกอบด้วยโลโก้เว็บไซต์ ช่องค้นหา รายการสินค้าในตะกร้า และลิงก์เข้าสู่ระบบของผู้ใช้

import { useAppSelector } from '@/redux/hook'
import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from 'react'
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart } from 'react-icons/ai'
import { BsSearch } from 'react-icons/bs'
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import AuthModal from "./AuthModal";
import axios from "axios";

interface PropsType {
    setShowCart: Dispatch<SetStateAction<boolean>>
}

const Navbar = ({ setShowCart }: PropsType) => {
    const { data: session } = useSession();
    const cartCount = useAppSelector((state) => state.cartReducer.length)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            setIsAuthModalOpen(true);
        } else {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    const handleCartClick = () => {
        if (!session) {
            setIsAuthModalOpen(true);
        } else {
            setShowCart(true);
        }
    };

    return (
        <div className='pt-4 bg-white top-0 sticky z-10'>
            <div className="container">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-4xl font-bold">Natapod Shop</Link>
                    <div className='lg:flex hidden w-full max-w-[500px]'>
                        <input className='border-2 border-accent px-6 py-2 w-full'
                            type="text"
                            placeholder='ค้นหาสินค้า...'
                        />
                        <div className='bg-accent text-white text-[26px] grid place-items-center px-4'>
                            <BsSearch />
                        </div>
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
                                    <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>รายการสินค้าโปรด</Link>
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

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    )
}

export default Navbar