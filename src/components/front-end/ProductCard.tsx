import {
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { useAppDispatch } from "@/redux/hook";
import { addToCart } from "@/redux/features/cartSlice";
import { makeToast } from "@/utils/helper";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { openAuthModal } from "@/redux/features/authModalSlice";

interface propsType {
    id: string;
    img: string;
    category: string;
    title: string;
    price: number;
    discountPrice?: number;
}

const ProductCard = ({ id, img, category, title, price, discountPrice }: propsType) => {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const router = useRouter();

    const addProductToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            makeToast("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า");
            dispatch(openAuthModal());
            return;
        }

        // Use discountPrice if available for cart, otherwise use regular price
        const finalPrice = discountPrice || price;

        const payload = {
            id,
            img,
            title,
            price: finalPrice,
            quantity: 1,
        };

        dispatch(addToCart(payload));
        makeToast("เพิ่มสินค้าลงตะกร้าแล้ว");
    };

    return (
        <Link href={`/product/${id}`} className="block border border-gray-200 hover:shadow-lg transition-shadow bg-white group">
            <div className="text-center border-b border-gray-200 p-4 bg-[#f9f9f9]">
                <img className="inline-block h-[200px] object-contain group-hover:scale-105 transition-transform" src={img} alt={title} />
            </div>

            <div className="px-6 py-4">
                <p className="text-gray-500 text-[12px] font-medium uppercase">{category}</p>
                <h2 className="font-bold text-gray-800 line-clamp-2 h-12 mt-1 transition-colors group-hover:text-accent">{title}</h2>

                <div className="flex justify-between items-center mt-4">
                    <div>
                        {discountPrice ? (
                            <div className="flex flex-col">
                                <span className="text-gray-400 line-through text-xs">฿{price.toLocaleString()}</span>
                                <span className="font-bold text-accent text-xl">฿{discountPrice.toLocaleString()}</span>
                            </div>
                        ) : (
                            <h2 className="font-bold text-accent text-xl">฿{price.toLocaleString()}</h2>
                        )}
                    </div>
                    <div
                        className="flex gap-2 items-center bg-accent text-white px-3 py-2 cursor-pointer
                        hover:bg-[#d41a1a] rounded text-sm transition-colors shadow-sm"
                        onClick={addProductToCart}
                    >
                        <AiOutlineShoppingCart size={18} />
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default ProductCard
