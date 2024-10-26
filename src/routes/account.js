// routes/account.js
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import deleteUserById from '../services/users/deleteUserById.js';
import updateUserById from '../services/users/updateUserById.js';
import getUserById from '../services/users/getUserById.js';
import sendDeleteEmail from '../services/email/sendDeleteEmail.js';
import sendUpdateEmail from '../services/email/sendUpdateEmail.js';
import auth from '../middleware/auth.js';

const router = Router();

// Get user account details
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user); // Return user data
  } catch (error) {
    next(error);
  }
});

// Update user account details
router.put(
  '/',
  auth,
  [
    body('username').optional().isString().withMessage('Username must be a string.'),
    body('email').optional().isEmail().withMessage('Must be a valid email.'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await updateUserById(req.user.id, req.body);
      sendUpdateEmail(user.email, user.username); // Send email to notify user about account update
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'Account updated successfully', user });
    } catch (error) {
      next(error);
    }
  }
);

// Delete user account
router.delete('/', auth, async (req, res, next) => {
  try {
    const user = await deleteUserById(req.user.id); // Retrieve user data before deletion
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('User Email:', user.email); // Log the email to check its value
    // Send email to notify user and admin about account deletion
    await sendDeleteEmail(user.email, user.username);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
