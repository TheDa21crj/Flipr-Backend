const user = require("../../models/userSchema");
const HttpError = require("../../models/HttpError");
const podcast = require("../../models/podcastSchema");
const { check, validationResult } = require("express-validator");

// Private || Create Podcast
const createPodcast = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, des, thumbnail, year, tag, category } = req.body;

  try {
    console.log(title, des, thumbnail, year, tag, category);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Cannot add user", 400);
    return next(error);
  }
};

exports.createPodcast = createPodcast;
