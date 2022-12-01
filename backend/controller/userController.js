const bcrypt = require("bcrypt");
const { User, Session } = require("../models/models");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//@method => POST
//@route => '/register'
// Requires JWT auth
const register = asyncHandler(async (req, res) => {
  //Get details from the request's body
  const { email, password, name } = req.body;

  //If the fields are empty then throw error
  if (!email || !password || !name) {
    res.status(401);
    throw new Error("Please enter all the details!");
  }
  //Else check if with same email exists already and throw Error
  else {
    if (await User.findOne({ email })) {
      res.status(401);
      throw new Error("You already have an account!");
    } else {
      //If everthing is fine then salt and hash the password
      const hashPass = await bcrypt.hash(password, 10);

      //Save the user in the database
      const user = await User.create({
        name: name,
        email: email,
        password: hashPass,
        authentication: "password",
      });

      //Send the response
      res.status(200).json({
        name: user.name,
        //Generate the JWT token for the current session
        token: genereateToken(user._id),
      });
    }
  }
});

//@method => POST
//@route => '/login'
// Requires JWT auth
const login = asyncHandler(async (req, res) => {
  //Get details from the request's body
  const { email, password } = req.body;

  //If the fields are empty then throw error
  if (!email || !password) {
    res.status(401);
    throw new Error("Please check you email and password!");
  } else {
    //Get user details from database
    const user = await User.findOne({ email });

    //Compare with the hashed password using bcrypt.compare
    if (user && (await bcrypt.compare(password, user.password))) {
      //If passwords match then generate JWT token and send the response
      res.status(200).json({
        name: user.name,
        token: genereateToken(user._id),
      });
    }
    //Else throw error
    else {
      res.status(401);
      throw new Error("Please check you email and password!");
    }
  }
});

//@method => POST
//@route => '/logout'
// Requires JWT auth
const logout = asyncHandler(async (req, res) => {
  //Get the user info from the request (set by the auth middleware)
  const user = req.user;

  //Delete the note from the database and send response
  await Session.deleteMany({ user_id: user._id });
  res.status(200).json({
    message: "Successfully logged out",
  });
});

//Function to generate JWT tokens
const genereateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  //Save the session details in the database
  Session.create({
    user_id: id,
    token: token,
  });

  return token;
};

//Export all the functions
module.exports = { register, login, logout };
