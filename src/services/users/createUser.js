import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createUser = async ({ name, email, username, password, image = null }) => {
  try {
    // Log the user data for debugging
    console.log({ name, email, username, password, image });

    // Check if the email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username },
        ],
      },
    });

    // Check for specific errors based on email or username
    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already exists');
      }
      if (existingUser.username === username) {
        throw new Error('Username already exists');
      }
    }

    // Ensure the password is not undefined or empty
    if (!password) {
      throw new Error('Password is required');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        image, // This will be null if no image is provided
      },
    });

    return newUser;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("User creation error:", error.message);
    throw error; // Rethrow to handle in the route
  } finally {
    await prisma.$disconnect(); // Ensure Prisma Client disconnects after operation
  }
};

export default createUser;
