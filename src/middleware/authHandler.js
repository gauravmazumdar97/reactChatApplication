require('dotenv').config()
const jwtHandler = require("../config/jwt-Token.js");
const User = require("../models/userModel.js");





/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const authToken = async (req, res, next) => {
  try {
    let accessToken = req.headers["authorization"] || req.headers["Authorization"];

    if (!accessToken) {
      return res.status(401).json({ message: "Please provide the access token" });
    }

    // Verify the token
    let decoded;
    try {
      decoded = await jwtHandler.verifyToken(accessToken);
    } catch (err) {
      return res.status(401).json({ message: "Invalid access token", err });
    }
    
    
    
    console.log('Decoded',decoded);
    req.user = await User.findById(decoded.id).select('-password');

    next();

  } catch (error) {
    console.log('error',error);
    return res.status(400).json({ error });
  }
}











// module.exports = { protect };
module.exports = { authToken };