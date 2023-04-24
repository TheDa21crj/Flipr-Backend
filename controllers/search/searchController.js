const user = require("../../models/userSchema");
const HttpError = require("../../models/HttpError");
const podcast = require("../../models/podcastSchema");
const { check, validationResult } = require("express-validator");

//Public || Podcast by Podcast ID
const podcastbyID = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  try {
    let podcastID = await podcast
      .findOne({ _id: id })
      .populate("episodes")
      .populate("author", "_id name avatar bio");

    if (podcastID) {
      console.log(podcastID);
      return res.status(202).json(podcastID);
    } else {
      return res.status(304).json("Does Not Exists");
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error", 400);
    return next(error);
  }
};

exports.podcastbyID = podcastbyID;
