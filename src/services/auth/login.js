// backend/src/services/auth/login.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const login = async (identifier, password) => {
  try {
    // Check if identifier is an email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier }, // If it's an email
          { username: identifier } // If it's a username
        ]
      }
    });

    if (!user) {
      // Return more specific error to indicate invalid credentials
      throw new Error('Invalid credentials');
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials'); // Consistent error message for security reasons
    }

    // Generate JWT token using AUTH_SECRET_KEY from the environment
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.AUTH_SECRET_KEY, {
      expiresIn: '1h', // Token expiration time
    });
    
    // Log the secret key for debugging
   //// console log auth secret key, removed for security reasons

    return token; // Return the token for further use
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Login error:", error.message);

    // Rethrow the error to the route handler to send appropriate response
    throw error;
  }
};

export default login;

