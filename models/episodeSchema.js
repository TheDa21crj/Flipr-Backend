const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  des: {
    type: String,
    required: true,
  },
  podcast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Podcast",
  },
  link: {
    type: String,
    required: true,
  },
  runTime: {
    type: String,
    default: "00:00",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const userList = new mongoose.model("Users", userSchema);

module.exports = userList;
