import { PrismaClient } from "@prisma/client";

const getCategoryById = async (id) => {
  const prisma = new PrismaClient();
  const category = await prisma.category.findUnique({
    where: { id },
  });

  return category;
};

export default getCategoryById;
