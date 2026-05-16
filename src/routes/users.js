import { Router } from "express";
import { body, validationResult } from 'express-validator';
import getUsers from "../services/users/getUsers.js";
import createUser from "../services/users/createUser.js";
import getUserById from "../services/users/getUserById.js";
import deleteUserById from "../services/users/deleteUserById.js";
import updateUserById from "../services/users/updateUserById.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import sendWelcomeEmail from "../services/email/sendWelcomeEmail.js";

const router = Router();

const userValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Signup route
router.post('/signup', upload.single('image'), userValidationRules(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, username, password } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newUser = await createUser(name, email, username, password, image);

    // Send welcome email in the background — username now passed correctly
    sendWelcomeEmail(email, username).catch((err) =>
      console.error('Welcome email error:', err)
    );

    // Return user + success message so frontend can show a toast
    res.status(201).json({
      message: `Welcome ${username}! Your account has been created. Check your email for a confirmation.`,
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({ message: `User with id ${id} not found` });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
});

// Delete user by ID
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await deleteUserById(id);

    if (user) {
      res.status(200).send({
        message: `User with id ${id} successfully deleted`,
        user,
      });
    } else {
      res.status(404).json({
        message: `User with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

// Update user by ID
router.put("/:id", auth, userValidationRules(), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, password, username, image } = req.body;
    const updatedData = { name, password, username, image };

    const user = await updateUserById(id, updatedData);

    if (user) {
      res.status(200).send({
        message: `User with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `User with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
