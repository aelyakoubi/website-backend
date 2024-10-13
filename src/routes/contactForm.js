import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'fs';
import pdf from 'html-pdf';
import path from 'path';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator'; // Import express-validator

const router = express.Router();

// Get the current directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to messages directory directly within the backend directory
const messagesDir = path.join(__dirname, '../messages');

// Create messages directory if it doesn't exist
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

// Utility function to get current date
const getCurrentDate = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = now.getFullYear();
  return `${day}-${month}-${year}`; // Format: DD-MM-YYYY
};

// Define the validation and sanitization rules
const contactValidationRules = [
  body('name').trim().escape().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('message').trim().escape().notEmpty().withMessage('Message is required.'),
];

router.post('/', contactValidationRules, async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, message } = req.body;

  try {
    const currentDate = getCurrentDate(); // Get current date

    // Log the email credentials for debugging
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Password:', process.env.EMAIL_PASS);

    // Create a transporter using nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.strato.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Prepare email for admin
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `You received a new message from ${name} (${email}) on ${currentDate}:\n\n${message}`,
    };

    // Prepare email for the user
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting us!',
      text: `Dear ${name},\n\nThank you for your message on ${currentDate}. We will get back to you as soon as possible.\n\nBest regards,\nYour Company`,
    };

    // Send the email to admin and user
    await transporter.sendMail(mailOptionsToAdmin);
    await transporter.sendMail(mailOptionsToUser);

    // Save the message as plain text
    const plainTextContent = `Message from: ${name} (${email})\nDate: ${currentDate}\n\n${message}`;
    fs.writeFileSync(path.join(messagesDir, `${name}-${currentDate}-message.txt`), plainTextContent);

    // Save the message as PDF
    const htmlContent = `
      <h3>Message from: ${name} (${email})</h3>
      <p>Date: ${currentDate}</p>
      <p>${message}</p>
    `;
    pdf.create(htmlContent).toFile(path.join(messagesDir, `${name}-${currentDate}-message.pdf`), (err, res) => {
      if (err) {
        console.error('Error generating PDF:', err);
      }
    });

    console.log('Messages Directory:', messagesDir);

    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error('Error sending email or saving files:', error);
    return res.status(500).json({ error: "Failed to send message." });
  }
});

export default router;
