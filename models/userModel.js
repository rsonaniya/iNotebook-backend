const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Name must equal or more than 3 character long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "password should be equal or more than 6 character long"],
  },
  date: {
    type: String,
    default: Date.now,
  },
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
