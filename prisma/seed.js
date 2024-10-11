import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // Import bcrypt for hashing passwords
import eventsData from "../src/data/events.json" assert { type: "json" };
import userData from "../src/data/users.json" assert { type: "json" };
import categoryData from "../src/data/categories.json" assert { type: "json" };

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

async function main() {
  const { events } = eventsData;
  const { users } = userData;
  const { categories } = categoryData;

  // Upsert categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // Upsert users with password hashing
  for (const user of users) {
    try {
      const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : null; // Hash password if it exists

      await prisma.user.upsert({
        where: { id: user.id }, // Ensure user JSON has id
        update: {
          name: user.name, // Update name if exists
          username: user.username, // Update username if exists
          email: user.email, // Update email if exists
          password: hashedPassword || undefined, // Update password only if provided (hashed)
          image: user.image || null, // Set image if provided, otherwise null
        },
        create: {
          ...user,
          password: hashedPassword, // Ensure password is hashed for new user
        },
      });
    } catch (error) {
      console.error(`Failed to upsert user with ID ${user.id}:`, error);
    }
  }

  // Upsert events
  for (const event of events) {
    if (event.categoryIds) {
      try {
        // Check if createdBy user exists
        const userExists = await prisma.user.findUnique({
          where: { id: event.createdBy },
        });

        if (!userExists) {
          console.error(`User with ID ${event.createdBy} does not exist. Skipping event ${event.title}.`);
          continue; // Skip this event if the user doesn't exist
        }

        await prisma.event.upsert({
          where: { id: event.id },
          update: {},
          create: {
            id: event.id,
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            image: event.image,
            categories: {
              connect: event.categoryIds.map((id) => ({ id })),
            },
            createdBy: {
              connect: { id: event.createdBy }, // Connect to existing user
            },
          },
        });
      } catch (error) {
        console.error(`Failed to upsert event with ID ${event.id}:`, error);
      }
    } else {
      console.error(`categoryIds missing for event with ID ${event.id}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
