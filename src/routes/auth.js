// src/routes/auth.js
//
// AANGEPAST: OAuth gebruikers krijgen nu een bcrypt-gehashed random wachtwoord
// in plaats van plaintext 'oauth-user'. Zo is de database consistent met
// normaal geregistreerde gebruikers.

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// POST /auth/oauth-sync
// Wordt aangeroepen door de frontend na een succesvolle Auth0 OAuth login.
// Ontvangt: { email, name, nickname/username } uit het Auth0 user object.
// Geeft terug: eigen JWT token + user object.
router.post('/oauth-sync', async (req, res) => {
  try {
    const { email, name, nickname, sub } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Controleer of gebruiker al bestaat in de database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Als gebruiker niet bestaat, maak een nieuw account aan
    if (!user) {
      // Genereer een random wachtwoord dat niemand kent of kan raden
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          username: nickname || email.split('@')[0],
          password: hashedPassword,
        },
      });
    }

    // Genereer eigen JWT token (zelfde formaat als normale login)
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('OAuth sync error:', error);
    res.status(500).json({ message: 'OAuth sync failed' });
  }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  const frontendUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://ivory-dugong-883765.hostingersite.com'
      : 'http://localhost:5173';

  res.redirect(frontendUrl);
});

export default router;
