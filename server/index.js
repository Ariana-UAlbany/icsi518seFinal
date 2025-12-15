import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import journalRoutes from "./routes/journals.js";//register the routes
import authRoutes from "./routes/auth.js";//register routes for Google OAuth

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/journals", journalRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Backend is working!" });
});

connectDB(process.env.MONGO_URI);//connect to mongodb env var

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});