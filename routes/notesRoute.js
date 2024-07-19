const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const router = express.Router();
const {
  getAllNotes,
  addNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");

router.get("/allnotes", fetchUser, getAllNotes);

router.post("/addnote", fetchUser, addNote);

router.put("/updatenote/:id", fetchUser, updateNote);

router.delete("/deletenote/:id", fetchUser, deleteNote);
module.exports = router;
