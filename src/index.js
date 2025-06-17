import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
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

// Use Helmet middleware
app.use(helmet());

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
app.use('/login', loginRouter);
app.use('/contact', contactFormRouter);

// Serve static files from the Vite build directory

// for DEVELOPMENT Comment out this block
app.use(express.static(path.join(process.cwd(), 'frontend', 'dist'))); // Adjust this path if needed

// Catch-all route to serve the index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend', 'dist', 'index.html'));
});
// for DEVELOPMENT Comment out this block till here

// Test route voor backend(Always keep this route for development/testing/debugging, but before the error handler)
// app.get('/', (req, res) => {
//   res.send(
//     '✅ Backend werkt! Gebruik /users of andere API-routes om verder te testen.'
//   );
// });

// Error handling middleware (should be at the end)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
