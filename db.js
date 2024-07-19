const mongoose = require("mongoose");

const mongoURI = process.env.DB;
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connectedd to db");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectToMongo;
