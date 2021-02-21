const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  durationInMonths: { type: Number },
  wakeTime: { type: String },
  sleepTime: { type: String },
  goals: {
    smallGoals: {},
    bigGoals: {},
  },
  images: { type: [String] },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
