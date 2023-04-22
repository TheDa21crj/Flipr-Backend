const mongoose = require("mongoose");

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
    default:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/podcast-youtube-thumbnail-design-template-3e13e5fd95f4f606afdb679cbc34bbcb_screen.jpg?ts=1600833688",
  },
  season: {
    type: "Number",
    required: true,
    default: 1,
  },
  videos: [{ type: String }],
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
