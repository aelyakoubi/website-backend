import nodemailer from 'nodemailer';
import validator from 'validator'; // Import validator for sanitization

const sendUpdateEmail = async (email, username) => {
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
    subject: 'Account Update Confirmation',
    text: `Hello ${sanitizedUsername}! Your details are updated We are glad to have you!`,
  };

  const mailOptionsToAdmin = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Admin email (your email)
    subject: 'Account Update Confirmation',
    text: `Accountdetails update for user:\n\nUsername: ${sanitizedUsername}\nEmail: ${email}`,
  };


  try {
    // Log the email being sent
    await transporter.sendMail(mailOptionsToUser);  /// maybe remove or without await
    console.log('Sending update email to:', email);

    // Send update confirmation email to the user
    await transporter.sendMail(mailOptionsToAdmin);
    console.log('Account update email sent successfully to user');
  } catch (error) {
    console.error('Error sending update email:', error);
  }
};

export default sendUpdateEmail;
