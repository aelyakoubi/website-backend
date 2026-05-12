// src/middleware/auth0.js
//
// Twee token validators:
//
// 1. jwtCheck — valideert Auth0 access tokens (RS256) via express-oauth2-jwt-bearer
//    Gebruik dit op routes die OAuth gebruikers (Google/GitHub/Microsoft) moeten beschermen.
//    Installeer eerst: npm install express-oauth2-jwt-bearer
//
// 2. verifyToken — valideert eigen JWT tokens (HS256) die bij normale login worden aangemaakt
//    Gebruik dit op routes die normale gebruikers (email/wachtwoord) moeten beschermen.

import { auth } from 'express-oauth2-jwt-bearer';
import jwt from 'jsonwebtoken';

// Auth0 JWT validator — voor OAuth gebruikers (Google/GitHub/Microsoft)
// Valideert het access token dat de Auth0 React SDK meestuurt
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256',
});

// Eigen JWT validator — voor normale email/wachtwoord login
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
