import { PrismaClient } from "@prisma/client";

const updateUserById = async (id, updatedUser) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.update({
    where: { id },
    data: updatedUser,
  });

  return user;  // Returns the updated user object directly
};

export default updateUserById;
