import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Note from "./NoteUpdate";

const Notes = () => {
  //Create instance of useNavigate()
  const navigate = useNavigate();

  //Get hold of the global state
  const { curr_user, setInfo, setCurrUser, loading, setLoading } =
    useContext(UserContext);

  //Runs on mount to check if a session is already active
  useEffect(() => {
    //If not logged in then route to login page
    if (!curr_user) navigate("/");
    //Else get the notes
    else {
      getNotes();
    }
  }, []);

  //Create a state for maintaining all the notes of current user
  const [allNotes, setAllNotes] = useState([]);

  //Create a state for maintaining new note's info
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  //Update the note's info on input change
  const updateNote = (e) => {
    setNote((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getNotes = async () => {
    setLoading(true);
    if (curr_user) {
      //Make a GET request to /login (backend API) with JWT token in the header
      const data = await fetch("/api/notes", {
        method: "get",
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
      });

      setLoading(false);

      //Check if status is success
      if (data.ok) {
        //Update the state
        setAllNotes(await data.json());
      } else {
        //Get the error message
        const { error } = await data.json();

        //Clear local storage and Global state for users
        setCurrUser(null);
        localStorage.clear();

        //Route to login page
        navigate("/");

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "warning" });
      }
    }
  };

  //Executes when the Save button is clicked
  const saveNote = async (e) => {
    setLoading(true);
    if (curr_user) {
      //Prevent the default action
      e.preventDefault();

      //Make a POST request to /notes (backend API) note info in request body and JWT token in header
      const data = await fetch("/api/notes", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(note),
      });

      //Check if status is success
      if (data.ok) {
        //Get details of new note from response
        const new_note = await data.json();

        //Setting global state for Alert
        setInfo({
          open: true,
          message: "Note saved successfully",
          type: "success",
        });

        //Update state for allNotes
        setAllNotes((prev) => [...prev, new_note.note]);

        //Reset note detials
        note.content = "";
        note.title = "";
        setLoading(false);
      } else {
        //Get the error message
        const { error } = await data.json();

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "warning" });

        //Clear local storage and Global state for users
        setCurrUser(null);
        localStorage.clear();

        //Route to the Login page
        navigate("/");
      }
    }
  };

  //Executes when the delete button is clicked
  const deleteNote = async (e) => {
    setLoading(true);
    if (curr_user) {
      //Prevent the default action
      e.preventDefault();

      // Make a post request to /delete (backend API) with note's info in the requst body and JWT token in the headers
      const data = await fetch("/api/delete", {
        method: "post",
        body: e.target.name,
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
      });

      setLoading(false);

      //Check if status is success
      if (data.ok) {
        //Setting global state for Alert
        setInfo({
          open: true,
          message: "Deleted note",
          type: "info",
        });

        //Update the state of allNotes
        setAllNotes((prev) =>
          prev.filter((note) => note._id !== JSON.parse(e.target.name).id)
        );
      } else {
        //Get the error message
        const { error } = await data.json();

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "warning" });

        //Clear local storage and Global state for users
        setCurrUser(null);
        localStorage.clear();

        //Route to the Login page
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center gap-3 mt-4">
        <div className="card p-3 w-75 test note-inp">
          <form onSubmit={saveNote} method="post">
            <div className="mb-3 inp-border">
              <input
                onChange={updateNote}
                value={note.title}
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="Title"
              />
            </div>
            <div className="mb-3">
              <textarea
                onChange={updateNote}
                value={note.content}
                required
                className="form-control"
                id="content"
                name="content"
                rows="3"
                placeholder="Description"
              ></textarea>
            </div>
            <div className="text-center">
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="container w-100 p-2 d-flex flex-row flex-wrap gap-5 justify-content-evenly">
          {loading
            ? [...new Array(3)].map((_, ind) => {
                return (
                  <Stack spacing={1} key={ind}>
                    <Skeleton variant="text" />
                    <Skeleton variant="rectangular" width={210} height={118} />
                  </Stack>
                );
              })
            : /* Map through all the notes and render the Notes component by passing props */
              allNotes.map((note) => (
                <Note
                  key={note._id}
                  note={note}
                  deleteNote={deleteNote}
                  refresh={getNotes}
                />
              ))}
        </div>
      </div>
    </>
  );
};

export default Notes;
