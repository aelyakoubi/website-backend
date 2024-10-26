import { PrismaClient } from "@prisma/client";

const updateEventById = async (id, updatedEvent, userId) => {
  const prisma = new PrismaClient();

  // Check if the event exists and the creator is the user attempting to update it
  const event = await prisma.event.findUnique({
    where: { id },
    select: { userId: true }, // Only select the userId for checking
  });

  if (!event) {
    return null; // Event not found
  }

  // Verify that the userId matches
  if (event.userId !== userId) {
    throw new Error('You are not authorized to update this event'); // Throw an error if not authorized
  }

  const { categoryIds, ...rest } = updatedEvent;

  // Update the event since the user is authorized
  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...rest,
      categories: categoryIds
        ? { set: categoryIds.map((id) => ({ id })) }
        : undefined,
    },
  });

  return updated; // Return the updated event
};

export default updateEventById;
