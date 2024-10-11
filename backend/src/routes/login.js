// backend/src/routes/login.js 

import { Router } from "express";
import login from "../services/auth/login.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // Accept identifier instead of username
    console.log("Identifier:", identifier); // Log identifier for debugging
    const token = await login(identifier, password);

    if (!token) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    return res.status(200).json({ message: "Successfully logged in!", token });
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    return res.status(500).json({ message: error.message }); // Send error message to the client
  }
});

export default router;
