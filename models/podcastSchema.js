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
  noofrating: {
    type: "Number",
    default: 0,
  },
  episodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
      default: "",
    },
  ],
  season: {
    type: "Number",
    required: true,
    default: 1,
  },
  subscribe: {
    type: "Number",
    required: true,
    default: 0,
  },
  type: {
    type: String,
    default: "",
    // required: true,
  },
  thumbnail: [{ type: String }],
  year: {
    type: "Number",
    required: true,
  },
  tag: [
    {
      type: String,
      required: true,
    },
  ],
  category: [
    {
      type: String,
      required: true,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const podcastList = new mongoose.model("Podcast", podcastSchema);

module.exports = podcastList;
