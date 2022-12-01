import React from "react";

export default function Homepage() {
  return (
    <home className={props.darkMode ? "dark" : ""}>
      <div>
        <h1> Journal Book </h1>
        <p> You have no notes yet.</p>
        <button>Take notes</button>
        {/* <button className="write-note" onClick={createNewNote}>Take notes</button> */}
      </div>
    </home>
  );
}
