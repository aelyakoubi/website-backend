import { PrismaClient } from "@prisma/client";

const createCategory = async (name) => {
  const prisma = new PrismaClient();
  const newCategory = {
    name,
  };

  const category = await prisma.category.create({
    data: newCategory,
  });

  return category;
};

export default createCategory;
