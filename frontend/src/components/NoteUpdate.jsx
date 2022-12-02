import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#a869cc",
  borderRadius: "10px",
  p: 4,
};

const Note = (props) => {
  const navigate = useNavigate();

  //Get hold of the global state
  const { curr_user, setInfo, setCurrUser, loading, setLoading } =
    useContext(UserContext);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const [note, setNote] = React.useState(props.note);

  const handleClose = () => setOpen(false);

  const changeNote = (e) => {
    setNote((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateNote = async (e) => {
    setLoading(true);
    if (curr_user) {
      //Prevent the default action
      e.preventDefault();

      //Make a POST request to /notes (backend API) note info in request body and JWT token in header
      const data = await fetch(
        "https://journalbookservies.onrender.com/api/update",
        {
          method: "post",
          headers: new Headers({
            Authorization: "Bearer " + curr_user.token,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ ...note, _id: props.note._id }),
        }
      );

      setLoading(false);

      //Check if status is success
      if (data.ok) {
        handleClose();
        props.refresh();

        //Setting global state for Alert
        setInfo({
          open: true,
          message: "Note updated successfully",
          type: "success",
        });

        //Reset note detials
        // note.content = "";
        // note.title = "";
      } else {
        //Get the error message
        const { error } = await data.json();

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "warning" });

        //Clear local storage and Global state for users
        setCurrUser(null);
        localStorage.clear();

        //Route to the Login page
        navigate("https://journalbookservies.onrender.com/");
      }
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form method="post" onSubmit={updateNote}>
            <div className="mb-3">
              <input
                onChange={changeNote}
                value={note.title}
                type="text"
                className="form-control editInput"
                id="title"
                name="title"
                placeholder="Title"
              />
            </div>
            <div className="mb-3">
              <textarea
                onChange={changeNote}
                value={note.content}
                required
                className="form-control editInput"
                id="content"
                name="content"
                rows="3"
                placeholder="Take a note...."
              ></textarea>
            </div>
            <div className="text-center">
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
      <form className="note d-flex flex-column g-5" method="post">
        <div className="d-flex justify-content-around align-items-center gap-2">
          <h5>{props.note.title}</h5>
          <div className="d-flex justify-content-around align-items-center">
            <IconButton onClick={handleOpen}>
              <EditIcon fontSize="small" />
            </IconButton>
            <button
              className="btn btn-sm btn-close"
              name={JSON.stringify({
                uid: props.note.user_id,
                id: props.note._id,
              })}
              onClick={props.deleteNote}
            ></button>
          </div>
        </div>
        <hr className="m-0 p-0" />
        <p>{props.note.content}</p>
      </form>
    </>
  );
};

export default Note;
