// backend/src/routes/contactForm.js will handle the POST request to submit the contact form.

import express from 'express';
import { body, validationResult } from 'express-validator';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { sendContactForm } from '../services/email/sendContactForm.js'; // Correct import

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

// Define the validation and sanitization rules
const contactValidationRules = [
  body('name').trim().escape().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('message').trim().escape().notEmpty().withMessage('Message is required.'),
];

// POST route to handle contact form submissions
router.post('/', contactValidationRules, async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, message } = req.body;

  try {
    // Call the sendContactForm function
    const response = await sendContactForm(name, email, message, messagesDir);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error sending email or saving files:', error);
    return res.status(500).json({ error: "Failed to send message." });
  }
});

export default router;

