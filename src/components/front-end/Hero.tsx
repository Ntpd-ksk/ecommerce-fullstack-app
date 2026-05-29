interface PropsType {
  scrollToProducts: () => void
}

const Hero = ({ scrollToProducts }: PropsType) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary-800 via-secondary-700 to-secondary-900 mt-1 md:mt-2">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[480px] py-12 md:py-16">
          {/* Copy */}
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-block bg-primary/20 text-primary-100 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border border-primary/30">
              ข้อเสนอสุดพิเศษประจำสัปดาห์
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-tight">
              คอลเลคชั่น
              <br />
              <span className="text-primary">สุดพิเศษ</span> ที่ดีที่สุด
            </h1>

            <p className="text-secondary-200 text-lg max-w-md mx-auto md:mx-0">
              เริ่มต้นที่ <span className="font-bold text-white">฿20,000</span>{" "}
              — ลดสูงสุด{" "}
              <span className="text-primary font-bold">10%</span> ภายในสัปดาห์นี้
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <button
                className="btn-buy text-base px-8 py-3.5"
                onClick={scrollToProducts}
              >
                ช้อปเลย
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 justify-center md:justify-start pt-4 text-secondary-300 text-sm">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                จัดส่งฟรี
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                ประกันศูนย์
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                ของแท้ 100%
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-90" />
              <img
                className="relative w-full max-w-sm md:max-w-md lg:max-w-lg object-contain drop-shadow-2xl"
                src="/hero.png"
                alt="สินค้าโปรโมชั่น"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
