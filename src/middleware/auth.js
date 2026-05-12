// src/middleware/auth.js
//
// This middleware protects routes by validating the user's JWT token.
// Every route that uses 'auth' as middleware passes through this function
// before the request is handled by the route itself.
//
// How it works:
//   1. Extract the token from the Authorization header
//   2. Verify the token using the secret key
//   3. Attach the user data to req.user so the route can use it
//   4. Call next() to continue to the route

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Retrieve the secret key from the environment variables (.env).
  // This key is used to sign and verify tokens.
  // If the key is missing, the app throws an error — this is intentional
  // so that a missing configuration is immediately obvious and not silently ignored.
  const secretKey = process.env.AUTH_SECRET_KEY;
  if (!secretKey) {
    throw new Error('AUTH_SECRET_KEY is not set in environment variables');
  }

  // Retrieve the Authorization header from the incoming request.
  // The frontend sends this as: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  // If no token was provided, return a 401 (not authenticated).
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Strip the "Bearer " prefix so only the token string remains.
  // Some clients send the token without the "Bearer " prefix, hence the check.
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader;

  try {
    // Verify the token against the secret key.
    // If the token is invalid or expired, jwt.verify() throws an error
    // which is caught in the catch block below.
    // algorithms: ['HS256'] ensures only HS256 signed tokens are accepted.
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });

    // Attach the user data to req.user so the route knows
    // which user is making the request (e.g. for authorization checks).
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };

    // Everything checks out — continue to the next middleware or route.
    next();
  } catch (error) {
    // TokenExpiredError means the token was valid but has since expired.
    // The user needs to log in again. Returns 401 (not authenticated).
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Any other error means the token is invalid (tampered, malformed, etc.).
    // Returns 403 (access denied).
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
