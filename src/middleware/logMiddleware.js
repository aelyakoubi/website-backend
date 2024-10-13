import { customLog, logger } from '../utils/log.js'; // Import both customLog and logger functions

// Middleware function for logging HTTP requests
const log = (req, res, next) => {
  // Record the start time of the request
  const start = new Date();

  // Call the next middleware or route handler in the stack
  next();

  // Calculate the duration of the request in milliseconds
  const ms = new Date() - start;

  // Use customLog to log the request information, applying filtering for sensitive data
  customLog(`${req.method} ${req.originalUrl}`, {
    statusCode: res.statusCode, // The HTTP status code returned to the client
    duration: `${ms} ms`, // The time taken to process the request
  });

  // Optionally, log detailed information to the console in non-production environments
  if (process.env.NODE_ENV !== "production") {
    logger.info(`${req.method} ${req.originalUrl}. Status: ${res.statusCode}. Duration: ${ms} ms`);
  }
};

// Export the logging middleware for use in your application
export default log;
