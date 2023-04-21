const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userMetaSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  podcast: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Podcast",
    },
  ],
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  userMetadata: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserMeta",
  },
  createdPodcast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Podcast",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const userMetaList = new mongoose.model("UserMeta", userMetaSchema);

module.exports = userMetaList;
