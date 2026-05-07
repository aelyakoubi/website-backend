// src/middleware/auth0.js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as Auth0Strategy } from 'passport-auth0';

const prisma = new PrismaClient();

// Passport Auth0 Strategy Configuration
passport.use(
  new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: '/auth/callback',
    },
    async (accessToken, refreshToken, extraParams, profile, done) => {
      try {
        // Check if user exists in database
        let user = await prisma.user.findUnique({
          where: { email: profile._json.email },
        });

        // If user doesn't exist, create one
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile._json.email,
              username:
                profile._json.nickname || profile._json.email.split('@')[0],
              name: profile._json.name,
              password: 'oauth-user', // Placeholder for OAuth users
              // Optional: store Auth0 profile picture
              // image: profile._json.picture,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Auth0 Strategy Error:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Middleware to verify JWT token from frontend
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

export default passport;
