import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

const createUser = async (req) => {
  // Validate incoming request using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error('Validation failed: ' + JSON.stringify(errors.array()));
  }

  const { name, email, username, password, image } = req.body;

  // Check if the email or username already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: username },
      ],
    },
  });

  if (existingUser) {
    throw new Error('Email or username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
      image // Store image path in the database, or null if no image
    },
  });

  return newUser;
};

export default createUser;
