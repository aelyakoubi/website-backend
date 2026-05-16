// src/routes/account.js

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import sendDeleteEmail from '../services/email/sendDeleteEmail.js';
import sendUpdateEmail from '../services/email/sendUpdateEmail.js';
import deleteUserById from '../services/users/deleteUserById.js';
import getUserById from '../services/users/getUserById.js';
import updateUserById from '../services/users/updateUserById.js';

const router = Router();

// GET /account — fetch the currently logged in user
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /account — update the currently logged in user
router.put(
  '/',
  auth,
  [
    body('username')
      .optional()
      .isString()
      .withMessage('Username must be a string.'),
    body('email').optional().isEmail().withMessage('Must be a valid email.'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      // Fetch the current user first for the email notification
      const currentUser = await getUserById(req.user.id);
      if (!currentUser)
        return res.status(404).json({ message: 'User not found' });

      await updateUserById(req.user.id, req.body);

      // Fetch the updated user to return in the response
      const updatedUser = await getUserById(req.user.id);

      // Send update email in the background
      sendUpdateEmail(updatedUser.email, updatedUser.username).catch((err) =>
        console.error('Update email error:', err)
      );

      res.json({ message: 'Account updated successfully', user: updatedUser });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /account — delete the currently logged in user
router.delete('/', auth, async (req, res, next) => {
  try {
    // Fetch the user BEFORE deleting — otherwise email and username are lost after deleteUserById
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Now delete the user
    await deleteUserById(req.user.id);

    // Send delete email in the background (non-blocking)
    sendDeleteEmail(user.email, user.username).catch((err) =>
      console.error('Delete email error:', err)
    );

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
