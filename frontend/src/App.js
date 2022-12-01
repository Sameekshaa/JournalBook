import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Notes from "./components/NoteSave";
import { UserContext } from "./contexts/UserContext";

function App() {
  //Create a state for maintaing the details of the logged in user (name,id and JWT token)
  const [curr_user, setCurrUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [loading, setLoading] = useState(false);

  //Create a state for the alert Info component(Alerts)
  const [info, setInfo] = useState({ open: false, message: "", type: "info" });
  return (
    <>
      <BrowserRouter>
        {/* Wrap all the components/routes with the Context provider , set the value of the global state*/}
        <UserContext.Provider
          value={{
            curr_user,
            setCurrUser,
            info,
            setInfo,
            loading,
            setLoading
          }}
        >
          <Navbar />  
          <Routes>
            {/*Declare all the routes and their corresponding Components*/}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="notes" element={<Notes />} />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
