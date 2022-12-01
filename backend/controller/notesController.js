const { Note } = require("../models/models");
const asyncHandler = require("express-async-handler");

//@method => GET
//@route => '/notes'
// Requires JWT auth
const getNotes = asyncHandler(async (req, res) => {
  //get the user info from the request (set by the auth middleware)
  const user = req.user;

  //Get all the notes of the current user from the database
  const notes = await Note.find({ user_id: user._id });

  //send the notes as json
  res.status(200).json(notes);
});

//@method => POST
//@route => '/notes'
// Requires JWT auth
const saveNote = asyncHandler(async (req, res) => {
  //Get the title and content of the note from the request body
  let { title, content } = req.body;

  //get the user info from the request (set by the auth middleware)
  const user = req.user;

  if (title.length == 0) {
    title = "Untitled";
  }
  //Create the note
  const note = await Note.create({
    user_id: user._id,
    title: title.trim(),
    content: content.trim(),
  });

  //Send the note back as response
  res.status(200).json({
    note: note,
  });
});

//@method => POST
//@route => '/update'
// Requires JWT auth
const updateNote = asyncHandler(async (req, res) => {
  let { title, content, _id } = req.body;

  if (title.length == 0) {
    title = "Untitled";
  }
  //Create the note
  const note = await Note.findByIdAndUpdate(
    _id,
    { title: title, content: content },
    { new: true }
  );

  //Send the note back as response
  res.status(200).json({
    note: note,
  });
});

//@method => POST
//@route => '/delete'
// Requires JWT auth
const deleteNote = asyncHandler(async (req, res) => {
  //get the user info from the request (set by the auth middleware)
  const user = req.user;

  //Check if the request is valid
  if (user._id != req.body.uid) {
    //If invadlid the set the status code and throw Error
    res.status(401);
    throw new Error("Please login to perform this action!");
  }
  //Else delete the note and send response
  else {
    await Note.deleteOne({ _id: req.body.id });
    res.status(200).json({
      message: "Note deleted successfully",
    });
  }
});

//Export all the functions
module.exports = { getNotes, saveNote, updateNote, deleteNote };
