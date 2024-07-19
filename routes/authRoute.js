const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/userModel");
const fetchUser = require("../middlewares/fetchUser");

const JWT_SECRET = process.env.JWT_SECRET;

//signup
router.post(
  "/createuser",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("name", "Please enter a valid name").isLength({ min: 3 }),
    body("password", "password length should be minimum 6 characters").isLength(
      { min: 6 }
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "fail",
        message: errors.array(),
      });
    }
    try {
      let newUser = await User.findOne({ email: req.body.email });

      if (newUser) {
        throw new Error("User with this Email already exists");
      }
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      //signup route

      newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });
      const data = { user: newUser._id };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({
        status: "success",
        authToken,
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  }
);

//login route

router.post(
  "/login",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "password can not be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "fail",
        message: errors.array(),
      });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "Please try again with correct credentials",
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          status: "fail",
          message: "Please try again with correct credentials",
        });
      }

      const data = { user: user._id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({
        status: "success",
        authToken,
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    }
  }
);

// route: get loggedin user detail login required

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    let userId = req.id;
    const user = await User.findById(userId).select("-password");

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
});

module.exports = router;
