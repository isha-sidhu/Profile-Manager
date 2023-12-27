import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Register new user
//@route           POST /api/users/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic, gender, Hobbies, dob } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    gender,
    Hobbies,
    dob,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      Hobbies: user.Hobbies,
      dob: user.dob,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc    GET user profile
// @route   GET /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);
  if (user) {
    user._id = req.body._id;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.gender = req.body.gender || user.gender;
    user.Hobbies = req.body.Hobbies || user.Hobbies;
    user.dob = req.body.dob || user.dob;

    const updatedUser = await user.save();
    const loggedInUser = await User.findById(req.user._id);

    const mappedUserData = {
      _id: loggedInUser._doc._id,
      name: loggedInUser._doc.name,
      email: loggedInUser._doc.email,
      pic: loggedInUser._doc.pic,
      gender: loggedInUser._doc.gender,
      Hobbies: loggedInUser._doc.Hobbies,
      dob: loggedInUser._doc.dob,
      isAdmin: loggedInUser._doc.isAdmin,
      token: generateToken(loggedInUser._doc._id),
    };
    res.json(mappedUserData);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @desc    GET all User profiles
// @route   GET /api/users/getAll
// @access  Private
const getAllProfiles = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (users) {
    const profiles = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      gender: user.gender,
      Hobbies: user.Hobbies,
      dob: user.dob,
      isAdmin: user.isAdmin,
    }));

    res.json(profiles);
  } else {
    res.status(404);
    throw new Error("No user profiles found");
  }
});

// @desc    GET a single User profile by ID
// @route   GET /api/users/getProfileById
// @access  Private
const getProfileById = asyncHandler(async (req, res) => {
  // Extract user ID from the query parameter
  const userId = req.query.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (user) {
      // Construct the profile object with desired fields
      const userProfile = {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        gender: user.gender,
        Hobbies: user.Hobbies,
        dob: user.dob,
        isAdmin: user.isAdmin,
      };

      res.json(userProfile);
    } else {
      res.status(404);
      throw new Error("User profile not found");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

export {
  authUser,
  updateUserProfile,
  registerUser,
  getAllProfiles,
  getProfileById,
};
