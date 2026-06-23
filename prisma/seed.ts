import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const password = "Admin7896";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const hashedPassword = await hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        name: "Admin System",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("Admin user created.");
  } else {
    console.log("Admin user already exists.");
  }

  const productsData = [
    // ====== Original 10 products (paths fixed, kept unchanged) ======
    {
      name: "AJAZZ AK871 Wireless Mechanical Keyboard คีย์บอร์ดไร้สาย TKL ตอบโจทย์ทุกการทำงาน",
      brand: "Ajazz",
      sku: "AK-871-WHT",
      price: 1890,
      discountPrice: 1450,
      warranty: "1 Year",
      tags: ["KEYBOARD", "คีย์บอร์ด", "MECHANICAL", "WIRELESS"],
      description: "คีย์บอร์ดไร้สายขนาด 80% ดีไซน์มินิมอล รองรับการเชื่อมต่อ 2.4GHz และ Bluetooth 5.0 สวิตช์เงียบพิมพ์สนุก แบตเตอรี่ใช้งานได้ยาวนาน เหมาะสำหรับจัดโต๊ะคอมสายคลีน",
      specs: {
        "Switch Type": "Ajazz Custom Switch",
        "Layout": "87 Keys (TKL)",
        "Connection": "2.4GHz / Bluetooth 5.0",
        "Battery": "2x AAA Batteries",
        "Keycap": "PBT Double-shot"
      },
      images: ["/products/Ajazz AK871.jpg"]
    },
    {
      name: "ANDA SEAT KAISER 3 Series Premium Gaming Chair เก้าอี้เกมมิ่งระดับไฮเอนด์เพื่อสุขภาพ",
      brand: "Anda Seat",
      sku: "AS-KSR3-XL",
      price: 15900,
      discountPrice: 12900,
      warranty: "6 Years",
      tags: ["CHAIR", "เก้าอี้เกมมิ่ง", "ERGONOMIC"],
      description: "ที่สุดของความสบายด้วยวัสดุหนัง DuraXtraเกรดพรีเมียม รองรับสรีระทุกส่วนด้วยระบบ Lumbar Support 4 ทิศทาง หมอนรองคอแม่เหล็กติดตั้งง่าย แข็งแรงทนทานรับน้ำหนักได้สูง",
      specs: {
        "Material": "DuraXtra Premium PVC Leather",
        "Max Weight": "180 kg",
        "Armrests": "4D Magnetic",
        "Gas Lift": "Class 4",
        "Size": "XL"
      },
      images: ["/products/Anda Seat Kaiser.jpg"]
    },
    {
      name: "HYPERX CLOUD III Gaming Headset หูฟังเกมมิ่งระดับตำนาน พัฒนาเพื่อความสบายขั้นสุด",
      brand: "HyperX",
      sku: "HX-CL3-BLK",
      price: 3590,
      discountPrice: 3090,
      warranty: "2 Years",
      tags: ["HEADSET", "หูฟัง", "GAMING", "HYPERX"],
      description: "หูฟังที่เกมเมอร์ทั่วโลกไว้วางใจ มาพร้อมไดรเวอร์ 53 มม. ปรับจูนใหม่ให้เสียงคมชัด ไมโครโฟนตัดเสียงรบกวนได้ดีเยี่ยม สวมใส่สบายได้ทั้งวันด้วยเมมโมรี่โฟมลิขสิทธิ์เฉพาะ",
      specs: {
        "Driver": "53mm Dynamic",
        "Frequency Response": "10Hz - 21kHz",
        "Connection": "USB-C, USB-A, 3.5mm",
        "Microphone": "Detachable Noise Cancelling",
        "Surround": "DTS:X Spatial Audio"
      },
      images: ["/products/HyperX cloud 3.png"]
    },
    {
      name: "HYPERX QUADCAST USB Condenser Microphone ไมโครโฟน RGB สำหรับสตรีมเมอร์",
      brand: "HyperX",
      sku: "HX-QC-RGB",
      price: 5990,
      discountPrice: 4990,
      warranty: "2 Years",
      tags: ["MICROPHONE", "ไมโครโฟน", "STREAMING"],
      description: "ไมโครโฟนแบบ All-in-one ที่มาพร้อม Shock mount ในตัว ช่วยลดเสียงกระแทก ไฟ RGB สวยงาม ปรับรูปแบบการรับเสียงได้ 4 ทิศทาง พร้อมปุ่ม Tap-to-Mute สะดวกต่อการใช้งาน",
      specs: {
        "Polar Pattern": "Stereo, Omnidirectional, Cardioid, Bidirectional",
        "Bit Rate": "16-bit",
        "Frequency Response": "20Hz - 20kHz",
        "Connection": "USB-A",
        "Lighting": "Red RGB"
      },
      images: ["/products/HyperX QuadCast.jpg"]
    },
    {
      name: "HYPERX SOLOCAST USB Microphone ไมโครโฟนตั้งโต๊ะขนาดกะทัดรัด เสียงชัดระดับโปร",
      brand: "HyperX",
      sku: "HX-SC-MINI",
      price: 1990,
      discountPrice: 1590,
      warranty: "2 Years",
      tags: ["MICROPHONE", "ไมโครโฟน", "GAMING"],
      description: "ไมโครโฟน USB ใช้งานง่ายแบบ Plug & Play ขนาดเล็กประหยัดพื้นที่โต๊ะคอม รับเสียงแบบ Cardioid เน้นเสียงพูดชัดเจน ลดเสียงรบกวนรอบข้าง เหมาะสำหรับแคสเกมและประชุมออนไลน์",
      specs: {
        "Polar Pattern": "Cardioid",
        "Sample Rate": "48kHz, 44.1kHz, 32kHz, 16kHz, 8kHz",
        "Connection": "USB-C",
        "Stand": "Flexible, Adjustable",
        "Mute Function": "Tap-to-Mute with LED indicator"
      },
      images: ["/products/HyperX SoloCast.jpg"]
    },
    {
      name: "LOGITECH G PRO X Wireless Gaming Headset หูฟังไร้สายระดับโปร พร้อมเทคโนโลยี Blue VO!CE",
      brand: "Logitech",
      sku: "LOGI-GPX-WLS",
      price: 6990,
      discountPrice: 5490,
      warranty: "2 Years",
      tags: ["HEADSET", "หูฟัง", "WIRELESS", "LOGITECH"],
      description: "สัมผัสความอิสระไร้สายด้วยเทคโนโลยี LIGHTSPEED ให้เสียงที่แม่นยำสูง ไมโครโฟนถอดออกได้พร้อมซอฟต์แวร์ปรับแต่งเสียงระดับมืออาชีพ โครงสร้างทำจากอลูมิเนียมและเหล็กแข็งแรง",
      specs: {
        "Driver": "PRO-G 50mm Mesh",
        "Wireless Technology": "LIGHTSPEED 2.4GHz",
        "Battery Life": "Up to 20 hours",
        "Wireless Range": "Up to 15 m",
        "Surround": "DTS Headphone:X 2.0"
      },
      images: ["/products/Logitech G PRO X Wireless.jpg"]
    },
    {
      name: "LOGITECH G PRO X SUPERLIGHT 2 Wireless Gaming Mouse เมาส์ไร้สายที่เบาและแม่นยำที่สุด",
      brand: "Logitech",
      sku: "LOGI-GPX2-BLK",
      price: 5990,
      discountPrice: 4990,
      warranty: "2 Years",
      tags: ["MOUSE", "เมาส์", "WIRELESS", "ESPORTS"],
      description: "วิวัฒนาการใหม่ของเมาส์ eSports ยอดนิยม น้ำหนักเบาเพียง 60 กรัม มาพร้อมเซนเซอร์ HERO 2 และสวิตช์ LIGHTFORCE Hybrid ตอบสนองไวและแม่นยำในระดับที่โปรเพลเยอร์เลือกใช้",
      specs: {
        "Sensor": "HERO 2",
        "Resolution": "100 - 32,000 DPI",
        "Max Acceleration": ">40G",
        "Weight": "60 g",
        "Polling Rate": "2000Hz (Dual-core)"
      },
      images: ["/products/logitech g pro2.png"]
    },
    {
      name: "LOGITECH G502 HERO High Performance Gaming Mouse เมาส์เกมมิ่งในตำนาน ปรับแต่งได้ดั่งใจ",
      brand: "Logitech",
      sku: "LOGI-G502-HERO",
      price: 2590,
      discountPrice: 1690,
      warranty: "2 Years",
      tags: ["MOUSE", "เมาส์", "GAMING", "RGB"],
      description: "เมาส์ที่ขายดีที่สุดตลอดกาล เซนเซอร์ HERO 25K ความแม่นยำสูงสุด พร้อมปุ่มที่ตั้งโปรแกรมได้ 11 ปุ่ม และตุ้มน้ำหนักสำหรับปรับแต่งสมดุลเมาส์ให้เข้ากับมือคุณ",
      specs: {
        "Sensor": "HERO 25K",
        "Resolution": "100 - 25,600 DPI",
        "Buttons": "11 Programmable",
        "Weight System": "5x 3.6g weights",
        "Lighting": "LIGHTSYNC RGB"
      },
      images: ["/products/Logitech G502 Hero.jpg"]
    },
    {
      name: "TENGU MASAMUNE Gaming Chair เก้าอี้เกมมิ่งสไตล์ญี่ปุ่น นั่งสบาย ดีไซน์โฉบเฉี่ยว",
      brand: "Tengu",
      sku: "TENGU-MSMN-RED",
      price: 4590,
      discountPrice: 3990,
      warranty: "1 Year",
      tags: ["CHAIR", "เก้าอี้เกมมิ่ง", "TENGU"],
      description: "เก้าอี้เกมมิ่งที่คุ้มค่าที่สุดในตลาดไทย วัสดุหนัง PU เกรดคุณภาพ นุ่มสบายไม่ยุบตัว พนักพิงปรับเอนได้ถึง 180 องศา ดีไซน์รูปทรงสปอร์ตเท่ไม่ซ้ำใคร",
      specs: {
        "Material": "High Quality PU Leather",
        "Reclining": "90 - 180 Degrees",
        "Base": "Nylon Castors",
        "Max Weight": "150 kg",
        "Cushion": "High Density Foam"
      },
      images: ["/products/Tengu Masamune.jpg"]
    },
    {
      name: "WOOTING 60HE Analog Mechanical Keyboard คีย์บอร์ด Hall Effect ที่เร็วที่สุดในโลก",
      brand: "Wooting",
      sku: "WOOT-60HE-60",
      price: 9900,
      discountPrice: 8900,
      warranty: "1 Year",
      tags: ["KEYBOARD", "คีย์บอร์ด", "ANALOG", "CUSTOM"],
      description: "ปฏิวัติวงการคีย์บอร์ดด้วยระบบสวิตช์แม่เหล็ก (Analog) รองรับฟีเจอร์ Rapid Trigger ตอบสนองทันทีที่ยกนิ้ว ปรับจุดกดได้ตามต้องการละเอียดถึง 0.1 มม. เหมาะสำหรับเกม FPS ระดับสูง",
      specs: {
        "Switch Type": "Lekker Magnetic Switch",
        "Layout": "60% Compact",
        "Response Time": "0.1ms",
        "Connection": "USB-C",
        "Special Features": "Rapid Trigger, Adjustable Actuation"
      },
      images: ["/products/Wooting 60HE.png"]
    },
    // ====== NEW: 11 product groups with multi-image + Thai details ======
    {
      name: "CHAIR COOLER MASTER HYBRID M BLACK เก้าอี้เกมมิ่งพร้อมระบบนวดในตัว",
      brand: "Cooler Master",
      sku: "CM-HYBRID-M-BK",
      price: 12900,
      discountPrice: 10900,
      warranty: "2 ปี",
      tags: ["CHAIR", "เก้าอี้เกมมิ่ง", "COOLER MASTER", "นวด"],
      description: "เก้าอี้เกมมิ่งไฮบริดจาก Cooler Master มาพร้อมฟังก์ชันเครื่องนวดในตัว บรรเทาอาการปวดเมื่อยจากการนั่งนาน วัสดุหนังคุณภาพสูง รองรับน้ำหนักได้ดี พนักพิงปรับเอนได้ 90-180 องศา",
      specs: {
        "วัสดุ": "หนัง PU คุณภาพสูง",
        "ฟังก์ชันนวด": "มี (ระบบนวดบริเวณบั้นเอว)",
        "ปรับเอน": "90 - 180 องศา",
        "ฐาน": "เหล็กแข็งแรง พร้อมล้อไนล่อน",
        "น้ำหนักรับได้": "150 กก."
      },
      images: [
        "/products/CHAIR COOLER MASTER HYBRID M BLACK (เก้าอี้+เครื่องนวด) 1.jpg",
        "/products/CHAIR COOLER MASTER HYBRID M BLACK (เก้าอี้+เครื่องนวด) 2.jpg",
        "/products/CHAIR COOLER MASTER HYBRID M BLACK (เก้าอี้+เครื่องนวด) 3.jpg"
      ]
    },
    {
      name: "CHAIR SIGNO GC212 ZORRON BLACK เก้าอี้เกมมิ่งดีไซน์เท่ นั่งสบาย",
      brand: "Signo",
      sku: "SIGNO-GC212-ZB",
      price: 4990,
      discountPrice: 4290,
      warranty: "2 ปี",
      tags: ["CHAIR", "เก้าอี้เกมมิ่ง", "SIGNO", "ZORRON"],
      description: "เก้าอี้เกมมิ่ง Signo รุ่น GC212 Zorron Black ดีไซน์สปอร์ตโฉบเฉี่ยวสีดำเท่ ๆ ใช้หนัง PU คุณภาพดี นุ่ม ทนทาน รองรับสรีระได้ดี พนักพิงปรับเอนได้ถึง 180 องศา",
      specs: {
        "วัสดุ": "หนัง PU",
        "ปรับเอน": "90 - 180 องศา",
        "ที่วางแขน": "ปรับระดับ 2D",
        "ฐาน": "เหล็กกล้า พร้อมล้อยาง",
        "น้ำหนักรับได้": "120 กก."
      },
      images: [
        "/products/CHAIR SIGNO GC212 ZORRON BLACK 1.jpg",
        "/products/CHAIR SIGNO GC212 ZORRON BLACK 2.jpg",
        "/products/CHAIR SIGNO GC212 ZORRON BLACK 3.jpg"
      ]
    },
    {
      name: "LOGITECH DRIVING FORCE SHIFTER เกียร์แข่งรถจำลองสำหรับ G29/G920",
      brand: "Logitech",
      sku: "LOGI-DF-SHIFTER",
      price: 1990,
      discountPrice: null,
      warranty: "1 ปี",
      tags: ["CONTROLLER", "LOGITECH", "RACING", "G29"],
      description: "ชุดเกียร์แข่งรถจำลองจาก Logitech สำหรับเพิ่มความสมจริงให้กับพวงมาลัย G29 และ G920 มาพร้อมเกียร์เดินหน้า 6 สปีด และเกียร์ถอยหลัง 1 ระยะ ตอบสนองแม่นยำ แข็งแรงทนทาน",
      specs: {
        "ประเภท": "เกียร์แข่งรถ 6+1 สปีด",
        "รองรับ": "Logitech G29 / G920",
        "การเชื่อมต่อ": "พอร์ต DIN (ต่อพ่วงกับพวงมาลัย)",
        "วัสดุ": "เหล็กและพลาสติกคุณภาพสูง",
        "ระบบ": "H-Pattern"
      },
      images: [
        "/products/CONTROLLER GAMING DRIVING FORCE SHIFTER LOGITECH 1.jpg",
        "/products/CONTROLLER GAMING DRIVING FORCE SHIFTER LOGITECH 2.jpg",
        "/products/CONTROLLER GAMING DRIVING FORCE SHIFTER LOGITECH 3.jpg"
      ]
    },
    {
      name: "LOGITECH G29 DRIVING FORCE RACING WHEEL พวงมาลัยแข่งรถจริง 6 สปีด",
      brand: "Logitech",
      sku: "LOGI-G29-WHEEL",
      price: 10900,
      discountPrice: 8900,
      warranty: "2 ปี",
      tags: ["CONTROLLER", "LOGITECH", "RACING", "พวงมาลัย"],
      description: "พวงมาลัยแข่งรถจำลอง Logitech G29 ให้สัมผัสสมจริงด้วยฟีดแบ็กแรงสั่น Dual-Motor Force Feedback ใบพัดเปลี่ยนเกียร์ติดตั้งที่พวงมาลัย พร้อมแป้นเหยียบ 3 แป้น",
      specs: {
        "ระบบ": "Force Feedback (Dual-Motor)",
        "มุมหมุน": "900 องศา",
        "แป้นเหยียบ": "3 แป้น (เร่ง, เบรก, คลัตช์)",
        "เกียร์": "ใบพัด + H-Pattern (แยกขาย)",
        "การเชื่อมต่อ": "USB + พอร์ตเกียร์"
      },
      images: [
        "/products/CONTROLLER GAMING RACING WHEEL LOGITECH G29 1.jpg",
        "/products/CONTROLLER GAMING RACING WHEEL LOGITECH G29 2.jpg",
        "/products/CONTROLLER GAMING RACING WHEEL LOGITECH G29 3.jpg"
      ]
    },
    {
      name: "HYPERX CLUTCH TALON WIRELESS CONTROLLER คอนโทรลเลอร์ไร้สายบลูทูธ",
      brand: "HyperX",
      sku: "HX-CT-WLS-BT",
      price: 1990,
      discountPrice: 1690,
      warranty: "1 ปี",
      tags: ["CONTROLLER", "HYPERX", "ไร้สาย", "บลูทูธ"],
      description: "คอนโทรลเลอร์ไร้สาย HyperX Clutch Talon รองรับการเชื่อมต่อแบบ Bluetooth และ 2.4GHz ใช้งานได้ทั้ง PC, Android และ Cloud Gaming ดีไซน์ตามหลักสรีรศาสตร์ จับถนัดมือ",
      specs: {
        "การเชื่อมต่อ": "Bluetooth 5.0 / 2.4GHz",
        "แบตเตอรี่": "ใช้ได้นานสูงสุด 20 ชม.",
        "รองรับ": "PC / Android / Cloud Gaming",
        "ฟีเจอร์": "ปุ่ม Turbo, ปุ่มลัดจับภาพ",
        "น้ำหนัก": "220 กรัม"
      },
      images: [
        "/products/CONTROLLER WIRELESS HYPERX CLUTCH TALON (BLUETOOTH) 1.jpg",
        "/products/CONTROLLER WIRELESS HYPERX CLUTCH TALON (BLUETOOTH) 2.jpg",
        "/products/CONTROLLER WIRELESS HYPERX CLUTCH TALON (BLUETOOTH) 3.jpg"
      ]
    },
    {
      name: "CORSAIR HS35 V3 WHITE หูฟังเกมมิ่งสีขาว 7.1 เสียงเซอร์ราวน์",
      brand: "Corsair",
      sku: "COR-HS35V3-WHT",
      price: 1690,
      discountPrice: 1390,
      warranty: "1 ปี",
      tags: ["HEADSET", "หูฟัง", "CORSAIR", "7.1"],
      description: "หูฟังเกมมิ่ง Corsair HS35 V3 สีขาวสวยงาม มาพร้อมระบบเสียงเซอร์ราวด์ 7.1 ให้มิติเสียงสมจริง ไมโครโฟนตัดเสียงรบกวน สวมใส่สบายด้วยเมมโมรี่โฟม เบามากเพียง 250 กรัม",
      specs: {
        "Driver": "40mm Neodymium",
        "ระบบเสียง": "7.1 Surround Sound (PC)",
        "ไมโครโฟน": "Omnidirectional ตัดเสียงรบกวน",
        "การเชื่อมต่อ": "USB-A / 3.5mm",
        "น้ำหนัก": "250 กรัม"
      },
      images: [
        "/products/HEADSET CORSAIR HS35 V3 WHITE (7.1) 1.jpg",
        "/products/HEADSET CORSAIR HS35 V3 WHITE (7.1) 2.jpg",
        "/products/HEADSET CORSAIR HS35 V3 WHITE (7.1) 3.jpg",
        "/products/HEADSET CORSAIR HS35 V3 WHITE (7.1) 4.jpg"
      ]
    },
    {
      name: "HYPERX CLOUD EARBUDS III S RED หูฟังอินเอียร์เกมมิ่งสายแดง",
      brand: "HyperX",
      sku: "HX-CE3S-RED",
      price: 990,
      discountPrice: 790,
      warranty: "1 ปี",
      tags: ["IN EAR", "หูฟัง", "HYPERX", "EARBUDS"],
      description: "หูฟังอินเอียร์ HyperX Cloud Earbuds III S รุ่นสาย 3.5mm มาพร้อมไมโครโฟนในสาย ใช้งานกับ PC, PlayStation, Xbox, Switch ได้ ดีไซน์สีแดงสวยงาม ให้เสียงเบสแน่นชัดเจน",
      specs: {
        "Driver": "10mm Neodymium",
        "การเชื่อมต่อ": "3.5mm 4-pole",
        "ไมโครโฟน": "มีในสาย",
        "รองรับ": "PC / PS / Xbox / Switch / มือถือ",
        "สี": "แดง"
      },
      images: [
        "/products/IN EAR HEADPHONE HYPERX CLOUD EARBUDS III S RED 1.jpg",
        "/products/IN EAR HEADPHONE HYPERX CLOUD EARBUDS III S RED 2.jpg",
        "/products/IN EAR HEADPHONE HYPERX CLOUD EARBUDS III S RED 3.jpg"
      ]
    },
    {
      name: "LOGITECH G512 X 75 KEYBOARD คีย์บอร์ด TKL สวิตช์ Tactile",
      brand: "Logitech",
      sku: "LOGI-G512X75-TC",
      price: 2490,
      discountPrice: 2090,
      warranty: "2 ปี",
      tags: ["KEYBOARD", "คีย์บอร์ด", "LOGITECH", "TACTILE"],
      description: "คีย์บอร์ด Logitech G512 X 75 ไซส์ TKL 75% กะทัดรัด มาพร้อม Tactile Switch ให้ความรู้สึกกระตุกเบา ๆ ขณะพิมพ์ ไฟ RGB LIGHTSYNC ปรับแต่งได้ ตัวเครื่องอะลูมิเนียมแข็งแรง",
      specs: {
        "Switch": "Logitech GX Tactile",
        "Layout": "75% (84 Keys)",
        "ไฟ": "LIGHTSYNC RGB",
        "การเชื่อมต่อ": "USB-C (ถอดสายได้)",
        "วัสดุ": "อะลูมิเนียมอัลลอย"
      },
      images: [
        "/products/KEYBOARD LOGITECH G512 X 75 BLACK (TACTILE SWITCH คีย์บอร์ด) 1.jpg",
        "/products/KEYBOARD LOGITECH G512 X 75 BLACK (TACTILE SWITCH คีย์บอร์ด) 2.jpg"
      ]
    },
    {
      name: "AULA AU75 GLACIER BLUE คีย์บอร์ดไร้สายบลูทูธ Star Switch",
      brand: "AULA",
      sku: "AULA-AU75-GB",
      price: 790,
      discountPrice: 590,
      warranty: "1 ปี",
      tags: ["KEYBOARD", "คีย์บอร์ด", "AULA", "ไร้สาย", "บลูทูธ"],
      description: "คีย์บอร์ดไร้สาย AULA AU75 Glacier Blue มาพร้อม Star Switch ให้สัมผัสที่นุ่มนวล ดีไซน์สี Glacier Blue สวยงาม เชื่อมต่อ Bluetooth 5.0 แบตเตอรี่อึด ใช้งานต่อเนื่องยาวนาน",
      specs: {
        "Switch": "AULA Star Switch (Blue)",
        "Layout": "75%",
        "การเชื่อมต่อ": "Bluetooth 5.0 / 2.4GHz",
        "แบตเตอรี่": "2000 mAh",
        "สี": "Glacier Blue"
      },
      images: [
        "/products/KEYBOARD WIRELESS BLUETOOTH AULA AU75 GLACIER BLUE (STAR SWITCH คีย์บอร์ด) 1.jpg",
        "/products/KEYBOARD WIRELESS BLUETOOTH AULA AU75 GLACIER BLUE (STAR SWITCH คีย์บอร์ด) 2.jpg",
        "/products/KEYBOARD WIRELESS BLUETOOTH AULA AU75 GLACIER BLUE (STAR SWITCH คีย์บอร์ด) 3.jpg"
      ]
    },
    {
      name: "CORSAIR SABRE V2 PRO WIRELESS MOUSE เมาส์ไร้สายเกมมิ่ง MG Black",
      brand: "Corsair",
      sku: "COR-SABREV2-BK",
      price: 2490,
      discountPrice: 1990,
      warranty: "2 ปี",
      tags: ["MOUSE", "เมาส์", "CORSAIR", "ไร้สาย", "CORSAIR SABRE"],
      description: "เมาส์ไร้สาย Corsair Sabre V2 Pro ดีไซน์สีดำ MG Black เซนเซอร์光学 26K DPI น้ำหนักเบา 79 กรัม รองรับการเชื่อมต่อ SLIPSTREAM Wireless, Bluetooth, และ USB-C แบตเตอรี่ใช้งานนาน 90 ชม.",
      specs: {
        "Sensor": "Corsair Marksman 26K DPI",
        "การเชื่อมต่อ": "SLIPSTREAM / Bluetooth / USB-C",
        "น้ำหนัก": "79 กรัม",
        "แบตเตอรี่": "สูงสุด 90 ชม.",
        "ปุ่ม": "6 ปุ่มตั้งโปรแกรมได้"
      },
      images: [
        "/products/MOUSE WIRELESS BLUETOOTH CORSAIR SABRE V2 PRO MG BLACK (เมาส์ไร้สาย) 1.jpg",
        "/products/MOUSE WIRELESS BLUETOOTH CORSAIR SABRE V2 PRO MG BLACK (เมาส์ไร้สาย) 2.jpg",
        "/products/MOUSE WIRELESS BLUETOOTH CORSAIR SABRE V2 PRO MG BLACK (เมาส์ไร้สาย) 3.jpg",
        "/products/MOUSE WIRELESS BLUETOOTH CORSAIR SABRE V2 PRO MG BLACK (เมาส์ไร้สาย) 4.jpg"
      ]
    },
    {
      name: "RAZER VIPER V4 PRO WHITE เมาส์ไร้สายเกมมิ่งสีขาวพิเศษ",
      brand: "Razer",
      sku: "RAZER-VVP4-WHT",
      price: 4990,
      discountPrice: 4290,
      warranty: "2 ปี",
      tags: ["MOUSE", "เมาส์", "RAZER", "VIPER", "ไร้สาย"],
      description: "เมาส์ไร้สาย Razer Viper V4 Pro สีขาว สวยสะดุดตา เซนเซอร์ Focus Pro 30K DPI ความแม่นยำระดับโปร สวิตช์ Optical รุ่นที่ 3 อายุการใช้งานยาวนาน 90 ล้านคลิก เชื่อมต่อ HyperSpeed Wireless",
      specs: {
        "Sensor": "Razer Focus Pro 30K DPI",
        "Switch": "Razer Optical Mouse Switch Gen-3 (90M คลิก)",
        "การเชื่อมต่อ": "HyperSpeed Wireless / Bluetooth / USB-C",
        "น้ำหนัก": "74 กรัม",
        "แบตเตอรี่": "สูงสุด 100 ชม."
      },
      images: [
        "/products/MOUSE WIRELESS RAZER VIPER V4 PRO WHITE (เมาส์ไร้สาย) 1.jpg",
        "/products/MOUSE WIRELESS RAZER VIPER V4 PRO WHITE (เมาส์ไร้สาย) 2.jpg",
        "/products/MOUSE WIRELESS RAZER VIPER V4 PRO WHITE (เมาส์ไร้สาย) 3.jpg",
        "/products/MOUSE WIRELESS RAZER VIPER V4 PRO WHITE (เมาส์ไร้สาย) 4.jpg",
        "/products/MOUSE WIRELESS RAZER VIPER V4 PRO WHITE (เมาส์ไร้สาย) 5.jpg"
      ]
    }
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        warranty: product.warranty,
        tags: product.tags,
        specs: product.specs,
        stock: 10,
        images: {
          deleteMany: {},
          create: product.images.map((url) => ({ url }))
        }
      },
      create: {
        name: product.name,
        brand: product.brand,
        sku: product.sku,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        warranty: product.warranty,
        tags: product.tags,
        specs: product.specs,
        stock: 10,
        images: {
          create: product.images.map((url) => ({ url }))
        }
      },
    });
  }

  console.log("Products seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
