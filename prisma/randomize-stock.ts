import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log(`พบสินค้าทั้งหมด ${products.length} รายการ`);

  if (products.length === 0) {
    console.log("ไม่มีสินค้าในฐานข้อมูล");
    return;
  }

  // สุ่มเลือก 5 รายการให้เป็นสินค้าหมด (stock = 0)
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  const outOfStockIds = new Set(shuffled.slice(0, 5).map(p => p.id));

  for (const p of products) {
    if (outOfStockIds.has(p.id)) {
      await prisma.product.update({
        where: { id: p.id },
        data: { stock: 0 }
      });
      console.log(`[หมดสต็อก - 0 ชิ้น] ${p.name}`);
    } else {
      // สุ่มสต็อกระหว่าง 10 ถึง 50 ชิ้น
      const randomStock = Math.floor(Math.random() * 41) + 10;
      await prisma.product.update({
        where: { id: p.id },
        data: { stock: randomStock }
      });
      console.log(`[มีสินค้า - ${randomStock} ชิ้น] ${p.name}`);
    }
  }

  console.log("อัปเดตสต็อกเรียบร้อยแล้ว!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
