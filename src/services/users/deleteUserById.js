// services/users/deleteUserById.js
import { PrismaClient } from "@prisma/client";

const deleteUserById = async (id) => {
  const prisma = new PrismaClient();

  // Retrieve the user before deleting
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return null; // User not found
  }

  // Delete the user
  await prisma.user.delete({
    where: { id },
  });

  return user; // Return the user data for email notification
};

export default deleteUserById;
