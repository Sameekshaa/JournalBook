const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT;
const jwtAuth = require("./middleware/authMiddleware");

//Tell express to use the json() middleware to process requests
app.use(express.json());

app.use(cors());

//Import all the necessary functions
const { login, register, logout } = require("./controller/userController");

const {
  getNotes,
  saveNote,
  deleteNote,
  updateNote,
} = require("./controller/notesController");

//Connect with the database
mongoose.connect(process.env.MONGO_URL, () => { 
  console.log("Connected to Mongo Successfully!");
});

//Define all the routes
app.route("/api/login").post(login);

app.route("/api/register").post(register);

//These routes require JWT tokens to gain access to the notes
app.route("/api/notes").get(jwtAuth, getNotes).post(jwtAuth, saveNote);

app.post("/api/update", jwtAuth, updateNote);

app.post("/api/delete", jwtAuth, deleteNote);

app.post("/api/logout", jwtAuth, logout);

app.get("/", (_, res) => {
  res.send("API is runnning successfully!!");
});

//Tell express to listen at specified PORT
app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
