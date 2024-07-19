const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fetchUser = (req, res, next) => {
  //get the user from the JWT token and add id to the request object\

  const token = req.header("auth-token");
  try {
    if (!token) {
      res.status(401).json({
        status: "fail",
        message: "please authenticate using valid token",
      });
    }

    const data = jwt.verify(token, JWT_SECRET);
    req.id = data.user;

    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "please authenticvate using valid token",
    });
  }
};
module.exports = fetchUser;
