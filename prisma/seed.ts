import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const password = "Admin7896";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log("Admin user already exists, skipping seed.");
    return;
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
