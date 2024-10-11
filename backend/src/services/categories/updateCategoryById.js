import { PrismaClient } from "@prisma/client";

const updateCategoryById = async (id, updatedCategory) => {
  const prisma = new PrismaClient();
  const category = await prisma.category.updateMany({
    where: { id },
    data: updatedCategory,
  });

  return category.count > 0 ? id : null;
};

export default updateCategoryById;
