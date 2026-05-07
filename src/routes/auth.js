// src/routes/auth.js
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router();
const prisma = new PrismaClient();

// Google login - initiates Auth0 Google strategy
router.get(
  '/google',
  passport.authenticate('auth0', { connection: 'google-oauth2' })
);

// GitHub login - initiates Auth0 GitHub strategy
router.get('/github', passport.authenticate('auth0', { connection: 'github' }));

// Microsoft login - initiates Auth0 Microsoft strategy
router.get(
  '/microsoft',
  passport.authenticate('auth0', { connection: 'windowslive' })
);

// Twitter login - initiates Auth0 Twitter strategy
router.get(
  '/twitter',
  passport.authenticate('auth0', { connection: 'twitter' })
);

// OAuth callback from Auth0
router.get(
  '/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      // User is now authenticated by Auth0 via Passport
      const user = req.user;

      // Generate JWT token for frontend
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.AUTH_SECRET_KEY,
        { expiresIn: '1h' }
      );

      // Redirect to frontend with token in query parameter
      // Frontend will extract this and store in localStorage
      const frontendUrl =
        process.env.NODE_ENV === 'production'
          ? `https://ivory-dugong-883765.hostingersite.com/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
          : `http://localhost:5173/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;

      res.redirect(frontendUrl);
    } catch (error) {
      console.error('Auth callback error:', error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    // Clear session and redirect to frontend
    const frontendUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://ivory-dugong-883765.hostingersite.com'
        : 'http://localhost:5173';

    res.redirect(frontendUrl);
  });
});

export default router;
