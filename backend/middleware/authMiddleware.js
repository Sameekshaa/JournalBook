const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User, Session } = require("../models/models");

const authentication = asyncHandler(async (req, res, next) => {
  //get the auth header from the request
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  //check if the auth header starts with "Bearer ....token"
  if (authHeader && authHeader.startsWith("Bearer")) {
    //extract the token from the header
    const token = authHeader.split(" ")[1];

    //Compare with session entry in the database for the current user
    if (await Session.findOne({ token: token })) {
      try {
        //Verify the token using jwt.verify() => returns the decoded value
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Get the user's ID from the token
        const userId = decoded.id;
        if (userId) {
          //Fetch the user's details from the DB excluding the password
          const user = await User.findById(userId).select("-password");

          //Set the user in request
          req.user = user;
          //Pass the control to the next function
          next();
        }
        //If user not found then throw error
        else {
          res.status(401);
          throw new Error("Session has expired");
        }
        //if token is not present in the header then throw error
        if (!token) {
          res.status(401);
          throw new Error("Token is not present in the header.");
        }
      } catch (err) {
        //Catch any error and throw
        throw new Error(err);
      }
    }
    //If the token of user is invalid throw error (comparing with entry in DB)
    else {
      res.status(401);
      throw new Error("Please authenticate using a valid token.");
    }
  }
  //If authorization header is not present in the request then throw error
  else {
    res.status(401);
    throw new Error("Session has expired");
  }
});

module.exports = authentication;
