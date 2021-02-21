const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  wakeTime: { type: String },
  sleepTime: { type: String },
  goals: {
    smallGoals: {},
    bigGoals: {},
  },
});

module.exports = mongoose.model("User", userSchema);
