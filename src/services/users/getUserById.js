import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Move the PrismaClient instantiation outside the function

const getUserById = async (id) => {
  if (!id) {
    throw new Error("User ID must be provided."); // Check if ID is undefined or null
  }
  
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error(`User with ID ${id} not found.`); // Handle case where user is not found
  }

  return user;
};

export default getUserById;
