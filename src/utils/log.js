import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file"; // Import daily rotate

const logger = winston.createLogger({
  level: "error", // Focus on logging errors only (adjust level as needed)
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

export default logger;
