//Component CartProduct เป็นส่วนหนึ่งของอินเทอร์เฟซที่แสดงข้อมูลของสินค้าในตะกร้า โดยรับ props เพื่อแสดงรายละเอียดของสินค้าแต่ละรายการและปุ่มเพื่อลบสินค้าออกจากตะกร้า

import { removeFromCart, updateQuantity } from "@/redux/features/cartSlice";
import { useAppDispatch } from "@/redux/hook";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface PropsType {
    id: string
    img: string
    title: string
    price: number
    quantity: number
}

const CartProduct: React.FC<PropsType> = ({
    id,
    img,
    title,
    price,
    quantity,
}) => {
    const dispatch = useAppDispatch()

    return (
        <div className="flex justify-between items-center py-2 border-b last:border-0">
            <div className="flex items-center gap-4">
                <img className="h-[80px] w-[80px] object-contain" src={img} alt={title} />
                <div className="space-y-1">
                    <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
                    <p className="text-gray-600 text-[12px]">
                        ฿{price}.00
                    </p>
                    <div className="flex items-center border border-gray-300 rounded w-fit">
                        <button
                            onClick={() => quantity > 1 && dispatch(updateQuantity({ id, quantity: quantity - 1 }))}
                            className="p-1 hover:bg-gray-100"
                        >
                            <AiOutlineMinus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold">{quantity}</span>
                        <button
                            onClick={() => dispatch(updateQuantity({ id, quantity: quantity + 1 }))}
                            className="p-1 hover:bg-gray-100"
                        >
                            <AiOutlinePlus size={12} />
                        </button>
                    </div>
                </div>
            </div>

            <RxCross1
                className="cursor-pointer text-gray-400 hover:text-red-500"
                onClick={() => dispatch(removeFromCart(id))}
            />
        </div>
    )
}

export default CartProduct