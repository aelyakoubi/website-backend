import { PrismaClient } from "@prisma/client";

const createEvent = async (
  title,
  description,
  location,
  image,
  startTime,
  endTime,
  createdBy,  // This will be the 'id' from the token
  categoryIds
) => {
  const prisma = new PrismaClient();

  if (!createdBy) {
    throw new Error("User ID (createdBy) is required to create an event.");
  }

  // Log the received category IDs for debugging
  console.log("Category IDs received:", categoryIds);

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        image,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdBy: {
          connect: { id: String(createdBy) },  // Use 'id' from the token
        },
        categories: {
          connect: Array.isArray(categoryIds)
            ? categoryIds.map((id) => ({ id: String(id) }))
            : [],
        },
      },
    });

    return event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export default createEvent;
