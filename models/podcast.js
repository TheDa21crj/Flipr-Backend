const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const podcastSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  podcast: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Podcast",
      subscribed: {
        type: "Boolean",
        default: false,
      },
      watching: {
        type: "string",
      },
      rating: {
        type: "Number",
        default: 0,
      },
    },
  ],
  password: {
    type: "string",
    required: true,
  },
  avatar: {
    type: "string",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const podcastList = new mongoose.model("Podcast", podcastSchema);

module.exports = podcastList;
