import { PrismaClient } from "@prisma/client";

const updateEventById = async (id, updatedEvent) => {
  const prisma = new PrismaClient();

  const { categoryIds, createdBy, ...rest } = updatedEvent;

  // Here we can't use updateMany() because we need to update the createdBy and categories fields if it is passed
  const event = await prisma.event.update({
    where: { id },
    data: {
      ...rest,
      createdBy: createdBy ? { connect: { id: createdBy } } : undefined,
      categories: categoryIds
        ? { set: categoryIds.map((id) => ({ id })) }
        : undefined,
    },
  });

  return event;
};

export default updateEventById;
