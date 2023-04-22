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

  let userE;

  console.table(res.locals.userData.userEmail);

  try {
    userE = await user.findOne({ email: res.locals.userData.userEmail });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Cannot add user", 400);
    return next(error);
  }

  if (userE) {
    const newPodcast = new podcast({
      title,
      des,
      thumbnail,
      year,
      tag,
      category,
      author: userE._id,
    });

    try {
      const createduser = await newPodcast.save();

      return res.json({ state: "success" });
    } catch (err) {
      console.log(err);
      const error = new HttpError("Cannot add user", 400);
      return next(error);
    }
  }
};

//Public || Podcast by Podcast ID
const podcastbyID = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  try {
    let podcast = await podcast.findOne({ _id: id });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Cannot add user", 400);
    return next(error);
  }
};

exports.createPodcast = createPodcast;
exports.podcastbyID = podcastbyID;
