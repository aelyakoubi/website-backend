import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided!' });
  }

  // Extract token, supporting Bearer scheme
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim(); 

  const secretKey = process.env.AUTH_SECRET_KEY || 'my-secret-key';

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token!' });
    }

    // Attach user info to the request object
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };

    next();
  });
};

export default authMiddleware;