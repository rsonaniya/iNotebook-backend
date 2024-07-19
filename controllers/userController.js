const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const fetchUser = require("../middlewares/fetchUser");
const JWT_SECRET = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
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
};

exports.login = async (req, res) => {
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
};

exports.getUser = async (req, res) => {
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
};
