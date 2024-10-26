// backend/src/services/email/sendContactForm.js

import nodemailer from 'nodemailer';
import fs from 'fs';
import pdf from 'html-pdf';
import path from 'path';

// Utility function to get current date
const getCurrentDate = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = now.getFullYear();
  return `${day}-${month}-${year}`; // Format: DD-MM-YYYY
};

export const sendContactForm = async (name, email, message, messagesDir) => {
  const currentDate = getCurrentDate(); // Get current date

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
  pdf.create(htmlContent).toFile(path.join(messagesDir, `${name}-${currentDate}-message.pdf`), (err) => {
    if (err) {
      console.error('Error generating PDF:', err);
    }
  });

  return { success: true, message: "Message sent successfully!" };
};
