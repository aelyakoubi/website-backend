import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import helmet from 'helmet';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import errorHandler from './middleware/errorHandler.js';
import log from './middleware/logMiddleware.js';
import categoriesRouter from './routes/categories.js';
import contactFormRouter from './routes/contactForm.js';
import eventsRouter from './routes/events.js';
import loginRouter from './routes/login.js';
import usersRouter from './routes/users.js';

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const app = express();

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use Helmet for security headers
app.use(helmet());

// Global rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use(generalLimiter);

// Login route limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts, please try again later.' },
});

// Global middleware
app.use(express.json());
app.use(log);

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CORS_ORIGIN
      : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Sentry initialization
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

// API routes
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/categories', categoriesRouter);
app.use('/login', loginLimiter, loginRouter);
app.use('/contact', contactFormRouter);

// **PRODUCTION ONLY**: Serve static frontend if dist exists
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // React Router catch-all
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
