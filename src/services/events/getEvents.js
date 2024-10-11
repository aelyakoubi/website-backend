import { PrismaClient } from "@prisma/client";

const getEvents = async (title, location) => {
  const prisma = new PrismaClient();
  const events = await prisma.event.findMany({
    where: {
      title: {
        contains: title,
      },
      location: {
        contains: location,
      },
    },
  });

  return events;
};

export default getEvents;
