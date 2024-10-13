import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

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
  if (!createdBy) {
    throw new Error("User ID (createdBy) is required to create an event.");
  }

  if (!isValidDate(startTime) || !isValidDate(endTime)) {
    throw new Error("Invalid date format for startTime or endTime.");
  }

  // Log the received category IDs for debugging
  console.log("Category IDs received:", categoryIds);

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        image: image || null, // Include image only if provided
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

    return {
      id: event.id,
      title: event.title,
      createdBy: event.createdBy,
      // Add other necessary fields here
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export default createEvent;
