const mongoose = require("mongoose");

//User schema with name,email and password
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter a email"],
      unique: true,
    },
    authentication: {
      type: String,
      required: [true, "Auth type is required"],
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Create the User model
const User = mongoose.model("User", userSchema);

//Note schema with user_id(who created the note), title of the note, content of the note
const noteSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
    content: {
      type: String,
      required: [true, "Please add a text value"],
    },
  },
  {
    timestamps: true,
  }
);

//Create the Note model
const Note = mongoose.model("Note", noteSchema);

//Session schema with user_id, JWT token
const sessionSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

//Create the Session model
const Session = mongoose.model("Session", sessionSchema);

module.exports = { Note, User, Session };
