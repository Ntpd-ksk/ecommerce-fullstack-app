// Component Hero เป็นส่วนหนึ่งของหน้าเว็บที่มีลักษณะเป็น Hero Section ซึ่งเป็นส่วนที่โดดเด่นและมักใช้เพื่อโปรโมทสินค้าหรือบริการ

const Hero = () => {
    return (
        <div className="bg-[#EBEDF6] mt-4">
          <div className="container grid md:grid-cols-2 py-8">
            <div className="flex items-center">
              <div className="max-w-[450px] space-y-4">
                <p className="text-topHeadingSecondary">
                  เริ่มต้นที่ <span className="font-bold">฿20,000</span>
                </p>

                <h1 className="text-topHeadingPrimary font-bold text-4xl md:text-5xl">
                  คอลเลคชั่นสุดพิเศษที่ดีที่สุด
                </h1>

                <h3 className="text-2xl font-['Oregano', cursive]">
                ข้อเสนอสุดพิเศษ <span className="text-red-600">-10%</span> ภายในสัปดาห์นี้
                </h3>

                <a
                  className="inline-block  bg-white rounded-md px-6 py-3 hover:bg-accent
                  hover:text-white font-bold"
                  href="#"
                >
                  ช้อปเลย
                </a>
                </div>
                </div>

                <div>
                    <img className="ml-auto" src="/hero.png" alt="hero" />
                </div>
            </div>
        </div>
    );
}

export default Hero