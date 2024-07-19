const express = require("express");

const router = express.Router();
const fetchUser = require("../middlewares/fetchUser");
const { createUser, login, getUser } = require("../controllers/userController");

//signup
router.post("/createuser", createUser);

//login route

router.post("/login", login);

// route: get loggedin user detail login required

router.post("/getuser", fetchUser, getUser);

module.exports = router;
