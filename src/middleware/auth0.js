// src/middleware/auth0.js
//
// AANGEPAST: Passport + passport-auth0 volledig verwijderd.
// OAuth (Google/GitHub/Microsoft) wordt nu afgehandeld door de Auth0 React SDK op de frontend.
// De backend ontvangt alleen nog het Auth0 access token en valideert dit via verifyToken.
//
// De backend heeft nu één taak bij OAuth login:
// POST /auth/oauth-sync → gebruiker opslaan in DB en eigen JWT teruggeven.

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Middleware to verify JWT token from frontend (eigen JWT na login/signup)
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
