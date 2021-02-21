const express = require("express");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/createUser", (req, res) => {
  const user = new User({
    username: req.body.username,
    goals: {
      smallGoals: {
        makeBed: req.body.goals.smallGoals.makeBed,
        drink1LWater: req.body.goals.smallGoals.drink1LWater,
        writeBlog: req.body.goals.smallGoals.writeBlog,
        readNewspaper: req.body.goals.smallGoals.readNewspaper,
        meditation: req.body.goals.smallGoals.meditation,
        journaling: req.body.goals.smallGoals.journaling,
      },
      bigGoals: {
        exercise: req.body.goals.bigGoals.exercise,
        readBook: req.body.goals.bigGoals.readBook,
        study: req.body.goals.bigGoals.study,
      },
    },
  });

  user.save().then((result) => {
    console.log(`User saved!`);
    return res.json({ id: user.id });
  });
});

router.get("/getUser", (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username }).then((user) => {
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({
      goals: user.goals,
    });
  });
});

module.exports = router;
