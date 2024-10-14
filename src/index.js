import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import usersRouter from "./routes/users.js";
import eventsRouter from "./routes/events.js";
import categoriesRouter from "./routes/categories.js";
import loginRouter from "./routes/login.js";
import log from "./middleware/logMiddleware.js";
import errorHandler from "./middleware/errorHandler.js";
import helmet from 'helmet';
import path from 'path';
import contactFormRouter from './routes/contactForm.js'; 
import rateLimit from 'express-rate-limit'; // Add the rate-limit import

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

const app = express();

// Set 'trust proxy' to enable correct interpretation of X-Forwarded-For header
app.set('trust proxy', 1); // Trust first proxy (Render's reverse proxy)

// Use Helmet middleware for security headers
app.use(helmet());

// Rate limiting applies globally to all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' },
});

// Rate limiting applies specifically to login route.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: { message: 'Too many login attempts, please try again later.' }, // Ensure this is an object for JSON response
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
  origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : 'http://localhost:5173',
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
app.use("/users", usersRouter);
app.use("/events", eventsRouter);
app.use("/categories", categoriesRouter);
app.use("/login", loginLimiter, loginRouter); // Apply login limiter here
app.use("/contact", contactFormRouter);

// Error handling middleware (should be at the end)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
