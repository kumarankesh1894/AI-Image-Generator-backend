import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import PostRouter from "./routes/Posts.js";
import GenerateImageRouter from "./routes/GenerateImage.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mari-ai.netlify.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/post", PostRouter);
app.use("/api/generateImage", GenerateImageRouter);

// Default GET route
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello Ankesh!",
  });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Connect to MongoDB
const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error("Failed to connect to DB");
      console.error(err);
    });
};

// Start the server (Render-compatible)
const startServer = async () => {
  try {
    connectDB();
    const PORT = process.env.PORT || 8080; // ✅ Render requires this
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
