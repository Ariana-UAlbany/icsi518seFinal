import mongoose from "mongoose";//define the journal schema

const journalSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
    },
    user: {//for privatization of user data when logging in with Google OAuth: every journal entry must belong to a user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;