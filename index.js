const express = require("express");
const app = express();
const port = 3000;

const communitiesRoutes = require("./routes/communities");
const mediaRoutes = require("./routes/media");

app.use("/api/communities", communitiesRoutes);
app.use("/api/media", mediaRoutes);

app.get("/", (req, res) => {
  res.send("Let's start building habits");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
