const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  goals: {
    smallGoals: {
      makeBed: Boolean,
      drink1LWater: Boolean,
      writeBlog: Boolean,
      readNewspaper: Boolean,
      meditation: Boolean,
      journaling: Boolean,
    },
    bigGoals: {
      exercise: Boolean,
      readBook: Boolean,
      study: Boolean,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
