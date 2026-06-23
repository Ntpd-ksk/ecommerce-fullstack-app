import { prisma } from "@/libs/prisma";
import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

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

        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ msg: "กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป" }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory might already exist
        }

        const imageUrls: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = new Uint8Array(bytes);
            const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
            const filePath = path.join(uploadDir, filename);

            await writeFile(filePath, buffer);
            imageUrls.push(`/uploads/${filename}`);
        }

        // @ts-ignore - Prisma types might not be updated yet until prisma generate succeeds
        const data = await prisma.product.create({
            data: {
                name,
                category,
                brand: brand || "",
                sku: `SKU-${Date.now()}`,
                description: description || "",
                price: Number(price),
                discountPrice: discountPrice ? Number(discountPrice) : null,
                stock: Number(stock) || 10,
                warranty: warranty || "",
                specs: specs ? JSON.parse(specs) : {},
                tags: tags ? JSON.parse(tags) : [],
                images: {
                    create: imageUrls.map(url => ({ url }))
                }
            },
            include: {
                // @ts-ignore
                images: true
            }
        })

        return NextResponse.json({ msg: "เพิ่มสินค้าสำเร็จ", data })
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