const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from communities route");
});

router.get("/getPeopleInSleepGroup", (req, res) => {
  const data = ["Suji", "Sohyun", "Justin"];
  res.send(data);
});

router.post("/addPerson", (req, res) => {});

module.exports = router;
