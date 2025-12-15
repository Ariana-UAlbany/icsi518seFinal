import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";

import journalRoutes from "./routes/journals.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

/**
 * ---- CORS (IMPORTANT) ----
 * Allow Vercel frontend + local dev
 */
app.use(
  cors({
    origin: [
      "https://icsi518se-final.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

/**
 * ---- HEALTH CHECK (MUST BE BEFORE DB) ----
 * Cloud Run readiness depends on this
 */
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

/**
 * ---- ROUTES ----
 */
app.use("/auth", authRoutes);
app.use("/api/journals", journalRoutes);

/**
 * ---- ROOT ----
 */
app.get("/", (req, res) => {
  res.send("MoodLog API is running");
});

/**
 * ---- START SERVER FIRST ----
 * Cloud Run requires listening before heavy work
 */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

/**
 * ---- CONNECT DB (NON-BLOCKING) ----
 * If this fails, health still works
 */
connectDB(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });