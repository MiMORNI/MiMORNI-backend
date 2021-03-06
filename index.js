const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const port = 8080;

dotenv.config();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const communitiesRoutes = require("./routes/communities");
const mediaRoutes = require("./routes/media");
const userRoutes = require("./routes/users");

app.use("/api/communities", communitiesRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/users", userRoutes);

app.route("/", (req, res) => {
  res.send("hello world");
});

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("Connecting to mongoDB")
);

app.listen(port, "0.0.0.0", () => {
  console.log(`App listening on port ${port}`);
});
