import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file"; // Import daily rotate

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
      filename: path.join(__dirname, "logs", "eventsite-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      zippedArchive: true,
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
