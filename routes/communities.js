const express = require("express");
const User = require("../models/User");

const router = express.Router();

/**
 * Get users with same wakeTime
 * @param {string} req.params.wakeTime - requested wakeTime
 * @return  {JSON} - return usernames with same wakeTime
 */
router.get("/getPeopleInGroup/wakeTime/:wakeTime", (req, res) => {
  const wakeTime = req.params.wakeTime;
  User.find({ wakeTime: wakeTime }).then((users) => {
    return res.json({ users: users });
  });
});

/**
 * Get users with same sleepTime
 * @param {string} req.params.sleepTime - requested sleepTime
 * @return  {JSON} - return usernames with same sleepTime
 */
router.get("/getPeopleInGroup/sleepTime/:sleepTime", (req, res) => {
  const sleepTime = req.params.sleepTime;
  User.find({ sleepTime: sleepTime }).then((users) => {
    return res.json({ users: users });
  });
});

/**
 * Calculate a user's achievement in a %
 * @param {string} req.params.username - username to get stats on
 * @return  {Number} - return user's % completion
 */
router.get("/getCommunity/:username/percentComplete", (req, res) => {
  const username = req.params.username;
  User.find({ username: username }).then((user) => {
    const goals = user[0].goals;
    let numGoals, numCompletedGoals;
    ({ numGoals, numCompletedGoals } = getCompletionStats(goals));
    if (numGoals == 0) return res.json({ percentComplete: 0 });
    return res.json({ percentComplete: (numCompletedGoals / numGoals) * 100 });
  });
});

/**
 * Calculate group's achievement in a %
 * @param {Array} req.params.users - Users to get aggregate stats on
 * @return  {Number} - return group's aggregate % of completion
 */
router.get("/getCommunity/percentComplete", (req, res) => {
  User.find({}).then((users) => {
    let foundUsers = users;
    let totalNumGoals = 0;
    let totalCompletedGoals = 0;
    users.forEach((user) => {
      let numGoals, numCompletedGoals;
      ({ numGoals, numCompletedGoals } = getCompletionStats(user.goals));
      totalNumGoals += numGoals;
      totalCompletedGoals += numCompletedGoals;
    });
    if (totalNumGoals == 0) return res.json({ percentComplete: 0 });
    const percentCompleteCommunity =
      (totalCompletedGoals / totalNumGoals) * 100;
    return res.json({
      percentCompleteCommunity: percentCompleteCommunity,
      users: foundUsers,
    });
  });
});

function getCompletionStats(goals) {
  let numSmallGoals = 0;
  let numBigGoals = 0;
  if (goals.hasOwnProperty("smallGoals")) {
    numSmallGoals = Object.keys(goals.smallGoals).length;
  }
  if ("bigGoals" in Object.keys(goals)) {
    numBigGoals = Object.keys(goals.bigGoals).length;
  }
  const numGoals = numSmallGoals + numBigGoals;
  let numCompletedSmallGoals = 0;
  let numCompletedBigGoals = 0;
  for (let goal in goals.smallGoals) {
    if (goals.smallGoals[goal]) numCompletedSmallGoals += 1;
  }
  for (let goal in goals.bigGoals) {
    if (goals.bigGoals[goal]) numCompletedBigGoals += 1;
  }
  const numCompletedGoals = numCompletedSmallGoals + numCompletedBigGoals;

  return { numGoals: numGoals, numCompletedGoals: numCompletedGoals };
}

module.exports = router;
