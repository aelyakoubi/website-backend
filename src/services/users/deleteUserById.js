import { PrismaClient } from "@prisma/client";

const deleteUserById = async (id) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.deleteMany({
    where: { id },
  });

  return user.count > 0 ? id : null;
};

export default deleteUserById;
