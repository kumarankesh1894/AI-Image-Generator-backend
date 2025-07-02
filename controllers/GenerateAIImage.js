import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

// Setup Google GenAI
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Controller to generate Image
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    console.log("API Response:", response); // Debug log

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("Invalid response format from API");
    }

    // Find the image part in the response
    const imagePart = response.candidates[0].content.parts.find(
      (part) => part.inlineData
    );

    if (!imagePart?.inlineData?.data) {
      throw new Error("No image data in response");
    }

    // The image data is already in base64 format
    const base64Image = imagePart.inlineData.data;

    return res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error("Error generating image:", error);
    next(
      createError(
        error.status || 500,
        error?.message || "Failed to generate image"
      )
    );
  }
};
