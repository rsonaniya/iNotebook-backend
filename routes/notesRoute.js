const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const router = express.Router();
const Notes = require("../models/notesModel");
const User = require("../models/userModel");

const { body, validationResult } = require("express-validator");

router.get("/allnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.id });
    let user = await User.findById(req.id).select("name");
    user = user.name;

    res.status(200).json({
      status: "success",
      notes,
      user,
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
});

router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Please enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      "Description must be at least 5 characters long"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "fail",
          message: errors.array(),
        });
      }

      const note = tag
        ? new Notes({
            title,
            description,
            tag,
            user: req.id,
          })
        : new Notes({
            title,
            description,
            user: req.id,
          });
      const savedNote = await note.save();
      res.status(201).json({
        status: "success",
        savedNote,
      });
    } catch (err) {
      return res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  }
);

router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  //create a new note object
  const newNote = {};

  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;

  //find the note and update

  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).json({
      status: "fail",
      message: "No note found by given id",
    });
  }
  if (note.user.toString() !== req.id) {
    return res.status(401).json({
      status: "fail",
      message: "You are not authorized to update this note",
    });
  }

  note = await Notes.findByIdAndUpdate(
    req.params.id,
    {
      $set: newNote,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    newNote,
  });
});

router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    console.log(req.params.id);
    const noteToBeDeleted = await Notes.findById(req.params.id);

    if (!noteToBeDeleted) {
      return res.status(404).json({
        status: "fail",
        message: "Note does not exists",
      });
    }

    if (noteToBeDeleted.user.toString() !== req.id) {
      return res.status(404).json({
        status: "fail",
        message: "You do not have permision to delete this note ",
      });
    }

    await Notes.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "note has been deleted",
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
});
module.exports = router;
