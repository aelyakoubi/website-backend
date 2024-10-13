import nodemailer from 'nodemailer';
import validator from 'validator'; // Import validator for sanitization

const sendWelcomeEmail = async (email, username) => {
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
    subject: 'Welcome to Our Service',
    text: `Hello ${sanitizedUsername}! Thank you for registering with us. We are glad to have you!`,
  };

  const mailOptionsToAdmin = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Admin email (your email)
    subject: 'New User Registered',
    text: `A new user has registered:\n\nUsername: ${sanitizedUsername}\nEmail: ${email}`,
  };

  try {
    // Send welcome email to the user
    await transporter.sendMail(mailOptionsToUser);
    console.log('Welcome email sent successfully');

    // Notify admin about the new registration
    await transporter.sendMail(mailOptionsToAdmin);
    console.log('Admin notified successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
};

export default sendWelcomeEmail;
