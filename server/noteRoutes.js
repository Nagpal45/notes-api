import express from "express";
const router = express.Router();
import Note from "./note.js";
import { body, validationResult } from "express-validator";


//Validation
const validateNote = [
  body("title").isString().isLength({ min: 3, max: 255 }),
  body("content").isString().isLength({ min: 6 }),
];

const validateContent = [body("content").isString().isLength({ min: 6 })];

//Create a note
router.post('/create', validateNote, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), error: "Invalid data" });
    }
  
    try {
      const { title, content } = req.body;
      const note = new Note({ title, content });
      await note.save();
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//Get all notes
router.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    if (!notes || notes.length === 0){
        return res.status(404).json({ error: "No notes found" });
    }
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get a specific note
router.get("/note/:id", async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//Update a note
router.put('/update/:id', validateContent, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() , error: "Invalid data"});
    }

    try {
        const content = req.body.content;
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            { content },
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Note
router.delete("/delete/:id", async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
