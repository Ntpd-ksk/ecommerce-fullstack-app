// Component Navbar เป็นส่วนหนึ่งของหน้าเว็บที่แสดงเมนูและเครื่องมือต่างๆ ซึ่งมักจะประกอบด้วยโลโก้เว็บไซต์ ช่องค้นหา รายการสินค้าในตะกร้า และลิงก์เข้าสู่ระบบของผู้ใช้

import { useAppSelector } from '@/redux/hook'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai'
import { BsSearch } from 'react-icons/bs'
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import AuthModal from "./AuthModal";

interface PropsType {
    setShowCart: Dispatch<SetStateAction<boolean>>
}

const Navbar = ({ setShowCart }: PropsType) => {
    const { data: session } = useSession();
    const cartCount = useAppSelector((state) => state.cartReducer.length)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleProfileClick = () => {
        if (!session) {
            setIsAuthModalOpen(true);
        } else {
            signOut();
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
                        <div className='md:flex hidden gap-3 items-center cursor-pointer' onClick={handleProfileClick}>
                            {session ? (
                                <div className="flex gap-3 items-center">
                                    <div className='rounded-full border-2 border-gray-300 text-gray-500 text-[32px] w-[50px] h-[50px] grid place-items-center overflow-hidden'>
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt="user" />
                                        ) : (
                                            <AiOutlineUser />
                                        )}
                                    </div>
                                    <div>
                                        <p className='text-gray-500 text-sm'>Hello, {session.user?.name}</p>
                                        <p className='font-medium'>ออกจากระบบ</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='rounded-full border-2 border-gray-300 text-gray-500 text-[32px] w-[50px] h-[50px] grid place-items-center hover:bg-gray-50 transition-colors'>
                                    <AiOutlineUser />
                                </div>
                            )}
                        </div>
                        <div
                            className='relative cursor-pointer'
                            onClick={handleCartClick}
                        >
                            <div className='rounded-full border-2 border-gray-300 text-gray-500 text-[32px] w-[50px] h-[50px] grid place-items-center hover:bg-gray-50 transition-colors'>
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