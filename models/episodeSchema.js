const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const episodeSchema = new mongoose.Schema({
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
  thumbnail: {
    type: String,
    required: true,
  },
  season: {
    type: "Number",
    required: true,
    default: 1,
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

const episodeList = new mongoose.model("Episode", episodeSchema);

module.exports = episodeList;
