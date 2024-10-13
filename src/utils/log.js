import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file"; // Import daily rotate
import { fileURLToPath } from 'url';

// Get the current module's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Create __dirname

const logger = winston.createLogger({
  level: "info", // You can adjust the logging level here
  format: winston.format.json(),
  defaultMeta: { service: "eventsite" },
  transports: [],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Add file rotation transport for production environments
if (process.env.NODE_ENV === "production") {
  logger.add(
    new DailyRotateFile({
      filename: path.join(__dirname, "logs", "eventsite-%DATE%.log"), // Log file pattern
      datePattern: "YYYY-MM-DD", // Rotate logs daily
      maxSize: "20m", // Maximum size of each log file (20 megabytes)
      maxFiles: "14d", // Keep logs for the last 14 days
      zippedArchive: true, // Compress old logs to save space
    })
  );
}

// Custom logging function
const customLog = (message, data) => {
  // Filter out sensitive information
  if (process.env.NODE_ENV === "production") {
    if (data) {
      // Define fields to redact
      const sensitiveFields = ["userIdentifier", "name", "username", "email", "password"];
      
      sensitiveFields.forEach(field => {
        if (data[field]) {
          data[field] = "REDACTED"; // Redact sensitive information
        }
      });
    }
  }

  // Log the message and data
  logger.info(message, data);
};

export { logger, customLog };