import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  //Get hold of the global state
  const { curr_user, setCurrUser, setInfo, loading, setLoading } =
    useContext(UserContext);

  //Create instance of useNavigate()
  const navigate = useNavigate();

  //Create a state for maintaining user info
  const [user, setUser] = useState({ email: "", password: "" });

  //Runs on mount to check if a session is already active
  useEffect(() => {
    if (curr_user) {
      navigate("https://journalbookservies.onrender.com/notes");
      return;
    }
  }, []);

  //Update the user's info on input change
  const updateUser = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //Executes when the login button is clicked
  const loginUser = async (e) => {
    setLoading(true);
    //Check if a session is active
    if (curr_user) {
      navigate("https://journalbookservies.onrender.com/notes");
    } else {
      //Prevent the default action
      e.preventDefault();

      //Make a POST request to /login (backend API) with user's info in the requst body
      const data = await fetch(
        "https://journalbookservies.onrender.com/api/login",
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
          message: "Logged in successfully",
          type: "success",
        });

        //Get the user's data and JWT token and store it in the localstorage
        const user_data = await data.json();
        localStorage.setItem("user", JSON.stringify(user_data));

        //Set the Global user state
        setCurrUser(user_data);

        //Navigate to the notes page
        navigate("https://journalbookservies.onrender.com/notes");
      } else {
        //Get the error message
        const { error } = await data.json();

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "error" });
      }
    }
  };

  return (
    <>
      <div className="container d-flex align-items-center flex-column gap-3 mt-3 justify-content-center mt-2">
        <h2>Sign In</h2>
        <div className="card text-bg home-card">
          <form onSubmit={loginUser}>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                value={user.email}
                onChange={updateUser}
                required
                type="email"
                placeholder="Enter your email"
                className="form-control"
                id="email"
                name="email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                value={user.password}
                onChange={updateUser}
                required
                type="password"
                placeholder="***********"
                className="form-control"
                id="password"
                name="password"
              />
            </div>

            <div className="mb-3">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <p className="mt-3">
              Don't have an account? Create one <Link to="/register">here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
