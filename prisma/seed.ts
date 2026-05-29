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
      image: "/Ajazz AK871.jpg"
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
      image: "/Anda Seat Kaiser.jpg"
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
      image: "/HyperX cloud 3.png"
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
      image: "/HyperX QuadCast.jpg"
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
      image: "/HyperX SoloCast.jpg"
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
      image: "/Logitech G PRO X Wireless.jpg"
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
      image: "/logitech g pro2.png"
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
      image: "/Logitech G502 Hero.jpg"
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
      image: "/Tengu Masamune.jpg"
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
      image: "/Wooting 60HE.png"
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
          create: [{ url: product.image }]
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
          create: [{ url: product.image }]
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
