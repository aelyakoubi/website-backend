import { PrismaClient } from "@prisma/client";

const deleteEventById = async (id, userId) => {
  const prisma = new PrismaClient();

  // Check if the event exists and the creator is the user attempting to delete it
  const event = await prisma.event.findUnique({
    where: { id },
    select: { userId: true }, // Only select the userId for checking
  });

  if (!event) {
    return null; // Event not found
  }

  // Verify that the userId matches
  if (event.userId !== userId) {
    throw new Error('You are not authorized to delete this event'); // Throw an error if not authorized
  }

  // Proceed to delete the event
  await prisma.event.delete({
    where: { id },
  });

  return id; // Return the ID of the deleted event
};

export default deleteEventById;
