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
        <tr className="border-b border-[#ececec] hover:bg-gray-50 cursor-pointer" onClick={onEdit}>
            <td className="py-2 text-center">
                <div>{srNo}</div>
            </td>
            <td>
                <div>{product.name}</div>
            </td>
            <td className="text-center">฿ {product.price}</td>
            <td className="py-2 flex justify-center">
                <Image
                    src={product.imagePath}
                    width={40}
                    height={40}
                    alt="product_image"
                    className="object-cover rounded"
                />
            </td>
            <td>
                <div className="text-2xl flex justify-center items-center gap-2 text-gray-600">
                    <RiDeleteBin5Line
                        className="text-[20px] cursor-pointer hover:text-red-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    />
                </div>
            </td>
        </tr>
    )
}

export default ProductRow
