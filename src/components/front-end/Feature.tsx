//Component Feature เป็นส่วนหนึ่งของหน้าแสดงข้อมูลเกี่ยวกับคุณสมบัติพิเศษของสินค้าหรือบริการ โดยแสดงข้อมูลในรูปแบบของ FeatureCard ซึ่งรับ props เพื่อแสดงไอคอน ชื่อ และคำอธิบายของคุณสมบัติ

import FeatureCard from "./FeatureCard";
import { TbTruckDelivery, TbDiscount } from "react-icons/tb";
import { RiRefund2Fill } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";

const data = [
  {
    icon: <TbTruckDelivery className="text-4x1" />,
    title: "จัดส่งฟรี",
    desc: "จัดส่งฟรีทุกรายการ",
  },
  {
    icon: <RiRefund2Fill className="text-4x1" />,
    title: "การคืนสินค้าและการคืนเงิน",
    desc: "รับประกันคืนเงิน",
  },
  {
    icon: <TbDiscount className="text-4x1" />,
    title: "ส่วนลดสมาชิก",
    desc: "เมื่อสั่งซื้อเกิน ฿1,000",
  },
  {
    icon: <MdSupportAgent className="text-4x1" />,
    title: "สนับสนุน",
    desc: "ติดต่อเราได้ตลอด 24 ชั่วโมง",
  },
]

const Feature = () => {
    return (
        <div className="container grid gap-1 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {data.map((item) => (
                <FeatureCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                />
            ))}
        </div>
    )
}

export default Feature