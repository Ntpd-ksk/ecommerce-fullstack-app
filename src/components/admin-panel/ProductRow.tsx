import { IProduct } from "@/app/admin/dashboard/page"
import { setProduct } from "@/redux/features/productSlice"
import { useAppDispatch } from "@/redux/hook"
import { Dispatch, SetStateAction } from "react"
import { CiEdit } from "react-icons/ci"
import Image from "next/image"
import { RiDeleteBin5Line } from "react-icons/ri"
import { setLoading } from "@/redux/features/loadingSlice"
import axios from "axios"
import { makeToast } from "@/utils/helper"

interface PropsType {
    srNo: number
    setOpenPopup: Dispatch<SetStateAction<boolean>>
    setUpdateTable: Dispatch<SetStateAction<boolean>>
    product: IProduct
}

const ProductRow = ({
    srNo,
    setOpenPopup,
    setUpdateTable,
    product
}: PropsType) => {
    const dispatch = useAppDispatch()

    const onEdit = () => {
        dispatch(setProduct(product))
        setOpenPopup(true)
    }

    const onDelete = () => {
        if (!confirm("ต้องการลบสินค้านี้ใช่หรือไม่?")) return

        dispatch(setLoading(true))
        axios.delete(`/api/delete_product/${product.id}`)
            .then(res => {
                console.log(res.data)
                makeToast("ลบสินค้าสำเร็จ")
                setUpdateTable((prevState) => !prevState)
            })
            .catch((err) => console.log(err))
            .finally(() => dispatch(setLoading(false)))
    }

    return (
        <tr className="hover:bg-gray-50 transition-colors cursor-pointer even:bg-gray-50/50" onClick={onEdit}>
            <td className="px-6 py-4 text-gray-500 font-medium text-sm">{srNo}</td>
            <td className="px-6 py-4">
                <Image
                    src={product.images && product.images.length > 0 ? product.images[0].url : '/placeholder.jpg'}
                    width={48}
                    height={48}
                    alt="product_image"
                    className="object-cover rounded-xl border border-gray-200 w-12 h-12"
                />
            </td>
            <td className="px-6 py-4">
                <div className="font-semibold text-gray-900">{product.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{product.brand || '-'}</div>
            </td>
            <td className="px-6 py-4 font-bold text-gray-900">฿{Number(product.price).toLocaleString()}</td>
            <td>
                <div className="flex justify-center gap-2">
                    <button
                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        title="แก้ไข"
                    >
                        <CiEdit className="text-lg" />
                    </button>
                    <button
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        title="ลบ"
                    >
                        <RiDeleteBin5Line className="text-lg" />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default ProductRow
