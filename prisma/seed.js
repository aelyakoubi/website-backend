import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // Import bcrypt for hashing passwords
import eventsData from "../src/data/events.json" assert { type: "json" };
import userData from "../src/data/users.json" assert { type: "json" };
import categoryData from "../src/data/categories.json" assert { type: "json" };
import { body, validationResult } from 'express-validator'; // Import express-validator for validation

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

// Validation rules for user data
const validateUser = (user) => {
  const errors = [];
  if (!user.name) errors.push("Name is required");
  if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) errors.push("Invalid email format");
  if (!user.username || user.username.length < 3 || user.username.length > 20) {
    errors.push("Username must be between 3 to 20 characters long");
  }
  if (user.password && user.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  return errors;
};

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
      // Ensure user JSON has an ID
      if (!user.id) {
        console.error("User data missing ID:", user);
        continue; // Skip this user if ID is missing
      }

      // Validate user data
      const errors = validateUser(user);
      if (errors.length) {
        console.error(`Validation errors for user ${user.username}:`, errors);
        continue; // Skip this user if validation fails
      }

      // Hash password if it exists
      const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : null;

      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          name: user.name || undefined,       // Update name if provided
          username: user.username || undefined, // Update username if provided
          email: user.email || undefined,      // Update email if provided
          password: hashedPassword || undefined, // Update password only if hashed
          image: user.image || null,           // Set image if provided, otherwise null
        },
        create: {
          name: user.name,                      // Ensure name is included
          username: user.username,              // Ensure username is included
          email: user.email,                    // Ensure email is included
          password: hashedPassword,              // Ensure password is hashed for new user
          image: user.image || null,            // Ensure image is included
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
