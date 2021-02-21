const express = require("express");
const User = require("../models/User");

const router = express.Router();

/**
 * Create a user
 * @param {string} req.body.username - New user's username
 * @param {string} req.body.goals - New user's goals
 * @param {string} req.body.wakeTime - New user's wakeTime
 * @param {string} req.body.sleepTime - New user's sleepTime
 * @return  {JSON} - return whether user was successfully created
 */
router.post("/createUser", (req, res) => {
  const user = new User({
    username: req.body.username,
    durationInMonths: req.body.durationInMonths,
    goals: req.body.goals,
    wakeTime: req.body.wakeTime,
    sleepTime: req.body.sleepTime,
  });

  user.save().then((result) => {
    return res.json({ created: true });
  });
});

/**
 * Get a user by username
 * @param {string} req.params.username - Requested user's username
 * @return  {JSON} - return user's attributes
 */
router.get("/getUser/:username", (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username }).then((user) => {
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({
      goals: user.goals,
      wakeTime: user.wakeTime,
      sleepTime: user.sleepTime,
    });
  });
});

/**
 * Update a user's goals
 * @param {string} req.params.username - Requested user's username
 * @return  {JSON} - return user's attributes
 */
router.put("/updateUserGoals/:username", (req, res) => {
  const username = req.params.username;
  const newGoals = req.body.goals;

  User.findOne({ username: username }).then((user) => {
    let goals = user.goals;
    let smallGoals = Object.keys(goals.smallGoals);
    let bigGoals = Object.keys(goals.bigGoals);
    for (let goal in newGoals) {
      if (smallGoals.includes(goal)) {
        goals.smallGoals[goal] = newGoals[goal];
      } else if (bigGoals.includes(goal)) {
        goals.bigGoals[goal] = newGoals[goal];
      }
    }
    user.goals = goals;
    user.save();
    res.send({ success: true });
  });
});

module.exports = router;
