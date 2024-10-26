// services/email/sendDeleteEmail.js
import nodemailer from 'nodemailer';
import validator from 'validator'; // Import validator for sanitization

const sendDeleteEmail = async (email, username) => {
  // Validate email format
  if (!email || !validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Sanitize username
  const sanitizedUsername = validator.escape(username);

  const transporter = nodemailer.createTransport({
    host: 'smtp.strato.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates (optional)
    },
  });

  const mailOptionsToUser = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Deletion Confirmation',
    text: `Hello, ${sanitizedUsername}! We're sorry to see you go! Your account has been successfully deleted. You are welcome to create a new account anytime on our site.`,
  };

  const mailOptionsToAdmin = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Admin email (your email)
    subject: 'Account Deletion Notification',
    text: `A user has deleted their account:\n\nUsername: ${sanitizedUsername}\nEmail: ${email}`,
  };

  try {
    // Log the email being sent
    console.log('Sending delete email to:', email);

    // Send deletion confirmation email to the user
    await transporter.sendMail(mailOptionsToUser);
    console.log('Account deletion email sent successfully to user');

    // Notify admin about the account deletion
    await transporter.sendMail(mailOptionsToAdmin);
    console.log('Admin notified successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
};

export default sendDeleteEmail;
