//Component Banner คือส่วนที่ใช้ในการแสดงโฆษณาหรือข้อมูลสำคัญบนหน้าเว็บ

const Banner = () => {
    return (
        <div className="container mt-32">
            <div className="grid lg:grid-cols-[66%, 34%] gap-4 pr-[15px]">
                <div className="h-[200px] md:h-[260px] bg-[url(/product-banner-1.jpg)] bg-cover
                bg-center rounded-xl p-8 md:p-16">
                </div>
                <div className="h-[260px] bg-[url(/product-banner-2.jpg)] bg-right rounded-xl hidden
                lg:block"></div>
            </div>
        </div>
    )
}

export default Banner