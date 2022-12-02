import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Register = () => {
  //Create instance of useNavigate()
  const navigate = useNavigate();

  //Get hold of the global state
  const { setCurrUser, setInfo, loading, setLoading } = useContext(UserContext);

  //Create a state for maintaining user info
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  //Update the user's info on input change
  const updateUser = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //Executes when the Register button is clicked
  const registerUser = async (e) => {
    //Prevent the default action
    e.preventDefault();

    setLoading(true);

    //Make a POST request to /register (backend API) with user's info in the requst body
    const data = await fetch(
      "https://journalbookservies.onrender.com/api/register",
      {
        method: "post",
        body: JSON.stringify(user),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }
    );

    setLoading(false);

    //Check if status is success
    if (data.ok) {
      //Setting global state for Alert
      setInfo({
        open: true,
        message: "Registered successfully",
        type: "success",
      });
      //Get the user's data and JWT token and store it in the localstorage
      const user_data = await data.json();
      localStorage.setItem("user", JSON.stringify(user_data));
      setCurrUser(user_data);

      //Navigate to the notes page
      navigate("/notes");
    } else {
      //Get the error message
      const { error } = await data.json();
      console.log(error);

      //Setting global state for Alert
      setInfo({ open: true, message: error.info, type: "error" });
    }
  };

  return (
    <>
      <div className="container d-flex align-items-center flex-column gap-3 mt-3 justify-content-center mt-2 ">
        <h2>Create your account </h2>
        <div className="card text-bg home-card">
          <form onSubmit={registerUser} method="post">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                onChange={updateUser}
                value={user.name}
                required
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                onChange={updateUser}
                value={user.email}
                required
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                onChange={updateUser}
                value={user.password}
                required
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="***********"
              />
            </div>
  
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>

            <p className="mt-3">
              Already have an account? Login <Link to="/">here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
