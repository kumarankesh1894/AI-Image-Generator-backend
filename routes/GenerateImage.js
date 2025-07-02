import express from "express";
import { generateImage } from "../controllers/GenerateAIImage.js";

const router = express.Router();

// ✅ POST route to generate image (used by frontend)
router.post("/", generateImage);

// ✅ Optional GET route to prevent 'Cannot GET' error
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Use POST method to generate an image with a prompt.",
  });
});

export default router;
