import { PrismaClient } from "@prisma/client";

const deleteEventById = async (id) => {
  const prisma = new PrismaClient();
  const event = await prisma.event.deleteMany({
    where: { id },
  });

  return event.count > 0 ? id : null;
};

export default deleteEventById;
