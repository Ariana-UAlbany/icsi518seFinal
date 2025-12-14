import express from "express";
import Journal from "../models/Journal.js";

const router = express.Router();

/**
 * POST /api/journals
 * Create a new journal entry
 */
router.post("/", async (req, res) => {
  try {
    const { text, mood } = req.body;

    const entry = new Journal({ text, mood });
    const savedEntry = await entry.save();

    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/journals
 * Get all journal entries
 */
router.get("/", async (req, res) => {
  try {
    const entries = await Journal.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/journals/:id
 * Update a journal entry
 */
router.put("/:id", async (req, res) => {
  try {
    const { text, mood } = req.body;

    const updatedEntry = await Journal.findByIdAndUpdate(
      req.params.id,
      { text, mood },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/journals/:id
 * Delete a journal entry
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedEntry = await Journal.findByIdAndDelete(req.params.id);

    if (!deletedEntry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    res.json({ message: "Journal entry deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;