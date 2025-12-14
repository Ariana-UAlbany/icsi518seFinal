import mongoose from "mongoose";//define the journal schema

const journalSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    mood: {
      type: String,
      required: true,
      enum: ["happy", "sad", "neutral", "stressed", "excited"]
    }
  },
  {
    timestamps: true
  }
);

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;