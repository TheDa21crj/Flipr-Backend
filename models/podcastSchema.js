const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  des: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  rating: {
    type: "Number",
    default: 0,
  },
  type: {
    type: String,
    required: true,
  },
  episodes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Episode",
  },
  season: {
    required: true,
    default: 1,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  year: {
    type: "Number",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const podcastList = new mongoose.model("Podcast", podcastSchema);

module.exports = podcastList;
