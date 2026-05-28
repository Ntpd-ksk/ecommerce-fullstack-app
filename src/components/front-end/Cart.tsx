//Component Cart เป็นส่วนหนึ่งของอินเทอร์เฟซที่แสดงตะกร้าสินค้าของผู้ใช้ โดยประกอบด้วยข้อมูลสินค้าที่มีอยู่ในตะกร้า รวมถึงปุ่มเพื่อดูตะกร้าและปุ่มสำหรับการชำระเงิน

import { RxCross1 } from 'react-icons/rx'
import CartProduct from './CartProduct'
import { useAppSelector } from '@/redux/hook'
import { useRouter } from 'next/navigation'

const Cart = ({ setShowCart }: any) => {
    const products = useAppSelector((state) => state.cartReducer)
    const router = useRouter()

    const getTotal = () => {
        let total = 0
        products.forEach((item) => (total = total + item.price * item.quantity))
        return total
    }

    const handleViewCart = () => {
        setShowCart(false)
        router.push('/cart')
    }

    const handleCheckout = () => {
        setShowCart(false)
        router.push('/checkout')
    }

    return (
        <div className='bg-[#0000007d] w-full min-h-screen fixed left-0 top-0 z-20
        overflow-y-scroll'>
            <div className='max-w-[400px] w-full min-h-full bg-white absolute right-0 top-0 p-6'>
                <RxCross1
                    className="absolute right-0 top-0 m-6 text-[24px] cursor-pointer"
                    onClick={() => setShowCart(false)}
                />
                <h3 className='pt-6 text-lg font-bold text-gray-600 uppercase'>
                    ตะกร้าของคุณ
                </h3>

                <div className='mt-6 space-y-2'>
                    {products?.map((item: any) => (
                        <CartProduct
                            key={item.id}
                            id={item.id}
                            img={item.img}
                            title={item.title}
                            price={item.price}
                            quantity={item.quantity}
                        />
                    ))}
                </div>

                <div className='flex justify-between items-center font-medium text-xl py-4'>
                    <p>รวม</p>
                    <p>฿{getTotal()}.00</p>
                </div>

                <button
                    className='bg-black text-white text-center w-full rounded-3xl py-2 hover:bg-accent mb-4 mt-4'
                    onClick={handleViewCart}
                >
                    ดูตะกร้า
                </button>
                <button
                    className='bg-black text-white text-center w-full rounded-3xl py-2 hover:bg-accent'
                    onClick={handleCheckout}
                >
                    ชำระเงิน
                </button>
            </div>
        </div>
    )
}

export default Cart