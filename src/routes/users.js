import { Router } from "express";
import { body, validationResult } from "express-validator";
import getUsers from "../services/users/getUsers.js";
import createUser from "../services/users/createUser.js";
import getUserById from "../services/users/getUserById.js";
import deleteUserById from "../services/users/deleteUserById.js";
import updateUserById from "../services/users/updateUserById.js";
import sendWelcomeEmail from "../services/email/sendWelcomeEmail.js"; // Importing sendWelcomeEmail
import auth from "../middleware/auth.js";
import multer from "multer";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

const router = Router();

const userValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

// User signup
router.post('/signup', upload.single('image'), userValidationRules(), async (req, res) => {
  const { name, email, username, password } = req.body;
  const imagePath = req.file ? req.file.path : null;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await createUser({ name, email, username, password, image: imagePath });
    await sendWelcomeEmail(email, username);
    res.status(200).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: `User with id ${id} not found` });
    }
    res.status(200).json(user);
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
      res.status(404).json({ message: `User with id ${id} not found` });
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
    const user = await updateUserById(id, { name, password, username, image });

    if (user) {
      res.status(200).send({
        message: `User with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({ message: `User with id ${id} not found` });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
