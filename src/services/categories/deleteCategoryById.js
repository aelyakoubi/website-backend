import { PrismaClient } from "@prisma/client";

const deleteCategoryById = async (id) => {
  const prisma = new PrismaClient();
  const category = await prisma.category.deleteMany({
    where: { id },
  });

  return category.count > 0 ? id : null;
};

export default deleteCategoryById;
