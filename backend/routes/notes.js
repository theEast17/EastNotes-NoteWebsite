const express = require('express');
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser')
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Route 1: GET The all notes using : GET "/api/notes/fetchallnotes" 
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (err) {
        // console.log(err.message);
        res.status(500).send('Internal Error Occured')
    }

})


// Route 2: add a notes using : POST "/api/notes/addnote" 
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // if there is an error it returns bad request and the errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote);
    } catch (err) {
        // console.log(err.message);
        res.status(500).send('Internal Error Occured')
    }
})


// Route 3: update a notes using : PUT "/api/notes/updatenote"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // create new note object

        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the notes to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (err) {
        // console.log(err.message);
        res.status(500).send('Internal Error Occured')
    }


})


// Route 4: delete a notes using : DELETE "/api/notes/deletenote"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the notes to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        // allow deletion only if the user is exists
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (err) {
        // console.log(err.message);
        res.status(500).send('Internal Error Occured')
    }


})
module.exports = router