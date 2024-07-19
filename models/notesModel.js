const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
    maxlength: [20, "A Note title must be less or equal than 20 character"],
    minlength: [3, "A Note title must be less or equal than 3 character"],
  },
  description: {
    type: String,
    required: true,
    minlength: [5, "A Note title must be less or equal than 5 character"],
  },
  tag: {
    type: String,
    default: "general",
  },
  date: {
    type: String,
    default: Date.now,
  },
});

const NoteModel = mongoose.model("notes", noteSchema);
module.exports = NoteModel;
