import { prisma } from "@/libs/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function PUT(request: NextRequest, URLParams: any) {
    try {
        const formData = await request.formData();
        const id = URLParams.params.id;

        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const brand = formData.get("brand") as string;
        const price = formData.get("price") as string;
        const discountPrice = formData.get("discountPrice") as string;
        const description = formData.get("description") as string;
        const stock = formData.get("stock") as string;
        const warranty = formData.get("warranty") as string;
        const specs = formData.get("specs") as string;
        const tags = formData.get("tags") as string;

        // ดึงไฟล์รูปภาพใหม่ (ถ้ามี)
        const files = formData.getAll("files") as File[];
        const keepExistingImages = formData.get("keepExistingImages") === "true";

        let imageUrls: string[] = [];

        if (files.length > 0) {
            const uploadDir = path.join(process.cwd(), "public/uploads");
            try { await mkdir(uploadDir, { recursive: true }); } catch (e) { }

            for (const file of files) {
                // ข้ามถ้าไม่ใช่ไฟล์จริง (กรณีส่ง string มา)
                if (!(file instanceof File)) continue;

                const bytes = await file.arrayBuffer();
                const buffer = new Uint8Array(bytes);
                const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
                const filePath = path.join(uploadDir, filename);

                await writeFile(filePath, buffer);
                imageUrls.push(`/uploads/${filename}`);
            }
        }

        // อัปเดตข้อมูลสินค้า
        const data = await prisma.product.update({
            where: { id },
            data: {
                name,
                category,
                brand,
                description,
                price: price ? Number(price) : undefined,
                discountPrice: discountPrice ? Number(discountPrice) : null,
                stock: stock !== undefined ? Number(stock) : undefined,
                warranty,
                specs: specs ? JSON.parse(specs) : undefined,
                tags: tags ? JSON.parse(tags) : undefined,
                images: imageUrls.length > 0 ? {
                    // ถ้าไม่อยากเก็บรูปเก่าไว้ ให้ลบทิ้งก่อน
                    deleteMany: keepExistingImages ? {} : {},
                    create: imageUrls.map(url => ({ url }))
                } : undefined
            },
            include: {
                // @ts-ignore
                images: true
            }
        });

        // ถ้าอัปโหลดรูปใหม่และไม่สั่งเก็บรูปเก่า ให้ตามไปลบไฟล์จริงด้วย (Optional logic)
        // เพื่อความง่ายในที่นี้จะลบรูปเก่าใน DB และเพิ่มใหม่ถ้ามีการส่งไฟล์มา

        return NextResponse.json({ msg: "แก้ไขสินค้าสำเร็จ", data });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            {
                error: error.message,
                msg: "Something Went Wrong"
            },
            { status: 400 }
        );
    }
}
