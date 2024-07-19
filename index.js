require("dotenv").config({ path: "./config.env" });
const connectToMongo = require("./db");
const cors = require("cors");

const express = require("express");
const app = express();
const port = 5000;
const authRouter = require("./routes/authRoute");
const notesRouter = require("./routes/notesRoute");

connectToMongo();
//middlewares

app.use(express.json());
//Available routes
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notes", notesRouter);

app.listen(port, () => {
  console.log(`iNoteBook app listening on port ${port}`);
});
