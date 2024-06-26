const User = require("../models/userModel");
const Message = require("../models/messageModel");
const chatModel = require("../models/chatModel");
const AWSConfig = require("../config/awsConfig");
const AuthToken = require("../config/jwt-Token");



class AuthController{


  /**
   * Register a new user
   * @param {Object} req - The request object containing the user's details.
   * @param {Object} res - The response object to send the response.
   */
  registerUser = async (req, res) => {
    try {
      const { name, email, password, pic } = req.body;

      // Validate that all required fields are provided
      if (!name || !email || !password || !pic) {
        return res.status(400).json({ message: "Please enter all the fields" });
      }

      // Check if the user already exists
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create a new user
      const user = await User.create({ name, email, password, pic });

      // If user creation is successful, return the user details
      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          pic: user.pic,
          isActive: 1,
          isDeleted: 1,
        });
      } else {
        return res.status(400).json({ message: "Failed to create user" });
      }
    } catch (error) {
      return res.status(400).json({ error });
    }
  };



  /**
   * Login a user
   * @param {Object} req - The request object containing the user's email and password.
   * @param {Object} res - The response object to send the response.
   */
  loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate that both email and password are provided
      if (!email || !password) {
        return res.status(400).json({ message: "Please enter all the fields" });
      }

      // Find the user by email
      const user = await User.findOne({ email });

      // If user is found, generate tokens and return the user and tokens
      if (user) {
        const tokens = await AuthToken.generateToken(user._id);
        return res.status(200).json({ user, tokens });
      } else {
        return res.status(401).json({ INVALID_USER: "Please register" });
      }
    } catch (error) {
      return res.status(400).json({ error });
    }
  };



  /**
   * Generate pre-signed URL for file upload
   * @param {Object} req - The request object containing the user's ID, folder name, and file name.
   * @param {Object} res - The response object to send the response.
   */
  preSignedUrl = async (req, res) => {
    try {
      const { email, folderName, fileName } = req.body;

      // Validate that both folder name and file name are provided
      if (!folderName || !fileName) {
        return res.status(400).json({ message: "Please enter all the fields" });
      }

      // Find the user by user ID
      const user = await User.findOne({ email });

      // If user is found, generate a pre-signed URL and return it
      if (user) {
        const signedUrl = await AWSConfig.generatePresignedUrl(
          folderName,
          fileName
        );
        return res.status(200).json({ signedUrl });
      } else {
        return res
          .status(401)
          .json({ USER_EXISTS: "User doesn't exists please login" });
      }
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  searchUser = async (req, res) => {
    try {
      console.log(req.user);

      const allUsers = await User.find({ _id: { $ne: req.user._id } });

      return res.status(200).json({ allUsers });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };





}








module.exports = new AuthController();