import { PrismaClient } from '@prisma/client';

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
    include: { categories: true }, // Uncomment if you want to include related categories changed for Hero.jsx
  });

  return events;
};

export default getEvents;
