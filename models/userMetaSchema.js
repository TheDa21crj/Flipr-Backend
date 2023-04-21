const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
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

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userList = new mongoose.model("Users", userSchema);

module.exports = userList;
