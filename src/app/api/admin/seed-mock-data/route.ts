import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function GET() {
  try {
    // 1. Check & Seed Products if empty
    let products = await prisma.product.findMany();
    if (products.length === 0) {
      const defaultProducts = [
        {
          name: "AJAZZ AK871 Wireless Mechanical Keyboard คีย์บอร์ดไร้สาย TKL ตอบโจทย์ทุกการทำงาน",
          brand: "Ajazz",
          sku: "AK-871-WHT",
          category: "คีย์บอร์ด",
          price: 1890,
          discountPrice: 1450,
          stock: 25,
          warranty: "1 Year",
          description: "คีย์บอร์ดไร้สายขนาด 80% ดีไซน์มินิมอล รองรับการเชื่อมต่อ 2.4GHz และ Bluetooth 5.0 สวิตช์เงียบพิมพ์สนุก",
          images: { create: [{ url: "/products/Ajazz AK871.jpg" }] }
        },
        {
          name: "ANDA SEAT KAISER 3 Series Premium Gaming Chair เก้าอี้เกมมิ่งระดับไฮเอนด์เพื่อสุขภาพ",
          brand: "Anda Seat",
          sku: "AS-KSR3-XL",
          category: "เก้าอี้เกมมิ่ง",
          price: 15900,
          discountPrice: 12900,
          stock: 8,
          warranty: "6 Years",
          description: "ที่สุดของความสบายด้วยวัสดุหนัง DuraXtra เกรดพรีเมียม รองรับสรีระทุกส่วน",
          images: { create: [{ url: "/products/Anda Seat Kaiser.jpg" }] }
        },
        {
          name: "HYPERX CLOUD III Gaming Headset หูฟังเกมมิ่งระดับตำนาน พัฒนาเพื่อความสบายขั้นสุด",
          brand: "HyperX",
          sku: "HX-CL3-BLK",
          category: "หูฟัง",
          price: 3590,
          discountPrice: 3090,
          stock: 14,
          warranty: "2 Years",
          description: "หูฟังที่เกมเมอร์ทั่วโลกไว้วางใจ มาพร้อมไดรเวอร์ 53 มม. ปรับจูนใหม่ให้เสียงคมชัด",
          images: { create: [{ url: "/products/HyperX cloud 3.png" }] }
        },
        {
          name: "LOGITECH G PRO X SUPERLIGHT 2 เมาส์เกมมิ่งไร้สายน้ำหนักเบาพิเศษ",
          brand: "Logitech G",
          sku: "LOGI-GPX2-BLK",
          category: "เมาส์",
          price: 5690,
          discountPrice: 4990,
          stock: 3, // Low stock test
          warranty: "2 Years",
          description: "เมาส์ไร้สายระดับโปรเกมเมอร์ น้ำหนักเพียง 60 กรัม เซนเซอร์ HERO 2 แม่นยำสูงสุด",
          images: { create: [{ url: "/products/Logitech G Pro X Superlight.jpg" }] }
        },
        {
          name: "HYPERX QUADCAST USB Condenser Microphone ไมโครโฟน RGB สำหรับสตรีมเมอร์",
          brand: "HyperX",
          sku: "HX-QC-RGB",
          category: "ไมโครโฟน",
          price: 5990,
          discountPrice: 4990,
          stock: 12,
          warranty: "2 Years",
          description: "ไมโครโฟนแบบ All-in-one ที่มาพร้อม Shock mount ในตัว ช่วยลดเสียงกระแทก ไฟ RGB สวยงาม",
          images: { create: [{ url: "/products/HyperX QuadCast.jpg" }] }
        },
        {
          name: "BENQ ZOWIE XL2546K 240Hz Gaming Monitor จอคอมเกมมิ่งสำหรับ Esports",
          brand: "BenQ ZOWIE",
          sku: "ZOWIE-XL2546K",
          category: "หน้าจอคอม",
          price: 18900,
          discountPrice: 16900,
          stock: 4, // Low stock test
          warranty: "3 Years",
          description: "จอเกมมิ่ง 240Hz 0.5ms พร้อมเทคโนโลยี DyAc+ คมชัดทุกการเคลื่อนไหว",
          images: { create: [{ url: "/products/BenQ Zowie XL2546K.jpg" }] }
        },
        {
          name: "RAZER BLACKWIDOW V4 PRO คีย์บอร์ดเกมมิ่งระดับโปรไฟ RGB",
          brand: "Razer",
          sku: "RZ-BW-V4PRO",
          category: "คีย์บอร์ด",
          price: 8990,
          discountPrice: 7990,
          stock: 0, // Out of stock test
          warranty: "2 Years",
          description: "คีย์บอร์ดแมคคานิคอลพร้อมแป้นหมุนมัลติฟังก์ชันและไฟ Underglow RGB รอบตัว",
          images: { create: [{ url: "/products/Razer BlackWidow V4 Pro.jpg" }] }
        }
      ];

      for (const item of defaultProducts) {
        await prisma.product.create({ data: item });
      }
      products = await prisma.product.findMany();
    }

    // 2. Ensure test customer accounts exist
    const testCustomers = [
      { email: "somchai@gmail.com", name: "สมชาย สายเกม", role: "USER" },
      { email: "wirat@gmail.com", name: "วิรัตน์ ชอบช้อป", role: "USER" },
      { email: "ananya@gmail.com", name: "อนัญญา มีสไตล์", role: "USER" },
      { email: "thanakorn@gmail.com", name: "ธนกร เทคโน", role: "USER" },
      { email: "ploy@gmail.com", name: "พลอยไพลิน คอมคลีน", role: "USER" },
    ];

    const customerIds: string[] = [];
    const dummyPassword = await hash("User12345", 10);

    for (const cust of testCustomers) {
      let u = await prisma.user.findUnique({ where: { email: cust.email } });
      if (!u) {
        u = await prisma.user.create({
          data: {
            email: cust.email,
            name: cust.name,
            password: dummyPassword,
            role: cust.role,
          }
        });
      }
      customerIds.push(u.id);
    }

    // 3. Create simulated realistic Orders across the past 30 days
    const statuses = ["SUCCESS", "PAID", "SHIPPING", "VERIFYING", "PROCESSING", "PENDING", "CANCELLED"];
    const statusWeights = [
      "SUCCESS", "SUCCESS", "SUCCESS", "PAID", "PAID", "SHIPPING", "SUCCESS",
      "VERIFYING", "VERIFYING", "PROCESSING", "SUCCESS", "PAID", "CANCELLED", "PENDING"
    ];

    const today = new Date();
    const createdOrdersCount = await prisma.order.count();

    // Create 25 realistic mock orders distributed across 30 days
    for (let i = 0; i < 28; i++) {
      // Pick random date within last 28 days
      const daysAgo = Math.floor(Math.random() * 28);
      const orderDate = new Date();
      orderDate.setDate(today.getDate() - daysAgo);
      orderDate.setHours(Math.floor(Math.random() * 14) + 9, Math.floor(Math.random() * 60));

      const randomUser = customerIds[Math.floor(Math.random() * customerIds.length)];
      const randomStatus = statusWeights[Math.floor(Math.random() * statusWeights.length)];

      // Pick 1-3 random products for the order
      const orderItemCount = Math.floor(Math.random() * 2) + 1;
      const shuffledProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, orderItemCount);

      let orderTotal = 0;
      const itemsData = shuffledProducts.map((prod) => {
        const qty = Math.floor(Math.random() * 2) + 1;
        const price = Number(prod.discountPrice || prod.price);
        orderTotal += price * qty;
        return {
          productId: prod.id,
          quantity: qty,
          price: price,
        };
      });

      await prisma.order.create({
        data: {
          userId: randomUser,
          total: orderTotal,
          status: randomStatus,
          paymentMethod: Math.random() > 0.3 ? "promptpay" : "bank",
          paymentSlip: randomStatus !== "PENDING" ? "/slips/sample-slip.jpg" : null,
          trackingNumber: ["SHIPPING", "SUCCESS"].includes(randomStatus) ? `TH${Math.floor(100000000 + Math.random() * 900000000)}` : null,
          createdAt: orderDate,
          updatedAt: orderDate,
          items: {
            create: itemsData,
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "สร้างข้อมูลจำลอง (Mock Data) สำหรับสรุปผลแดชบอร์ดสำเร็จเรียบร้อย!",
      createdSampleOrders: 28,
    });
  } catch (error: any) {
    console.error("Mock seed analytics error:", error);
    return NextResponse.json(
      { error: error.message, message: "เกิดข้อผิดพลาดในการสร้างข้อมูลจำลอง" },
      { status: 500 }
    );
  }
}
