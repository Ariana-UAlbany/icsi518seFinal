import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import journalRoutes from "./routes/journals.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/journals", journalRoutes);
app.use("/auth", authRoutes);

// Health check (used by Cloud Run)
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Root
app.get("/", (req, res) => {
  res.send("API is running!");
});

const PORT = process.env.PORT || 8080;

// ✅ SAFE STARTUP: only listen after MongoDB connects
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // fail fast so Cloud Run knows it's unhealthy
  }
};

startServer();