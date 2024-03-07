import fs from "node:fs";
// import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createFile({
  altText,
  filepath,
}: {
  altText?: string;
  filepath: string;
}) {
  console.log("📁 Creating File...");
  const file = await fs.promises.readFile(filepath);
  console.log("📁 Created File...");
  return {
    altText,
    contentType: "application/pdf",
    blob: file,
  };
}

async function seed() {
  console.log("🌱 Seeding...");

  console.time("🧹 Cleaned up the database...");
  await prisma.file.deleteMany();
  console.timeEnd("🧹 Cleaned up the database...");
  // const file = await fs.promises.readFile("./tests/files/test.pdf");

  const files = await createFile({
    altText: "faker.lorem.sentence()",
    filepath: "./tests/files/test.pdf",
  });
  console.log("file is  ", files);
  console.time(`👤 Creating  File...`);

  await prisma.file.create({
    data: { ...files },
  });
  console.log("👤 Created  File...");
  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error("error or something");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
