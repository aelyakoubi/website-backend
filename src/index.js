import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
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

// Trust first proxy if needed (uncomment if applicable)
// app.set('trust proxy', 1);

// Use of Helmet middleware for security headers
app.use(helmet());

// Rate limiting applies globally to all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs                       ///// You need to change this to 100 times for more security !!!!!
  message: {
    message: 'Too many requests from this IP, please try again later.',
  },
});

// Rate limiting for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs                       ///// change this to 5 or more times for more security !!!!!
  message: { message: 'Too many login attempts, please try again later.' },
});

// Apply global rate limiter
app.use(generalLimiter);

// Global middleware
app.use(express.json());
app.use(log);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Configure CORS with custom allowed headers
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

// API Routes
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/categories', categoriesRouter);
app.use('/login', loginLimiter, loginRouter); // added the login limiter here
app.use('/contact', contactFormRouter);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve static files from the Vite build directory
app.use(express.static(path.join(process.cwd(), 'frontend', 'dist'))); // Adjust this path if needed

// Catch-all route to serve the index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend', 'dist', 'index.html')); // Adjust this path if needed
});

// Error handling middleware (should be at the end)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
