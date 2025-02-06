// backend/src/middleware/auth.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization;
  const secretKey = process.env.AUTH_SECRET_KEY || 'my-secret-key';

  // Debugging, should be removed in production
//// console log auth secret key, removed for security reasons


  if (!token) {
    return res.status(401).json({ message: 'You cannot access this operation without a token!' });
  }

  // Check if token starts with "Bearer " and remove it if necessary
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  // Verifying the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(403).json({ message: 'Invalid token provided!' });
    }

    // Use 'id' instead of 'userId' since the token contains 'id'
    console.log("Decoded token:", decoded);
    req.user = {
      id: decoded.id,  // Ensure 'id' from the token is assigned
      username: decoded.username,
    };

    next();
  });
};

export default authMiddleware;
