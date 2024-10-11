import { PrismaClient } from "@prisma/client";

const getUsers = async () => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();

  return users;
};

export default getUsers;
