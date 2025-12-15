import express from "express";
import Journal from "../models/Journal.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

/**
 * POST /api/journals
 * Create a new journal entry
 */
router.post("/", async (req, res) => {
  const { text, mood } = req.body;

  const entry = await Journal.create({
    text,
    mood,
    user: req.user._id,
  });

  res.status(201).json(entry);
});

/**
 * GET /api/journals
 * Get user specific journal entries
 */
router.get("/", async (req, res) => {
  const entries = await Journal.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(entries);
});

/**
 * PUT /api/journals/:id
 * Update a journal entry
 */
router.put("/:id", async (req, res) => {
  const entry = await Journal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );

  if (!entry) {
    return res.status(404).json({ error: "Entry not found" });
  }

  res.json(entry);
});

/**
 * DELETE /api/journals/:id
 * Delete a journal entry
 */
router.delete("/:id", async (req, res) => {
  const entry = await Journal.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!entry) {
    return res.status(404).json({ error: "Entry not found" });
  }

  res.json({ message: "Entry deleted" });
});

export default router;