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

    console.log({ user }); // Log the user object

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.AUTH_SECRET_KEY, {
      expiresIn: '1h',
    });

    return token;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};


export default login;
