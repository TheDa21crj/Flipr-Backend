const user = require("../../models/userSchema");
const HttpError = require("../../models/HttpError");
const podcast = require("../../models/podcastSchema");
const { check, validationResult } = require("express-validator");

// Private || Create Podcast
const createPodcast = async (req, res, next) => {
  console.log(req.body);

  const { title, des, tags, category } = req.body;

  console.table(typeof tags);

  let tag = tags.split(",");

  let userE;

  let videosPaths = [];

  if (Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
    for (let video of req.files.thumbnail) {
      videosPaths.push("/" + video.path);
    }
  }

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
      thumbnail: videosPaths,
      year: new Date().getFullYear(),
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
    let podcastID = await podcast.findOne({ _id: id });

    if (podcastID) {
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

// Public || Season +-
const seasonPodcast = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, Change } = req.body;

  try {
    let podcastID = await podcast.findOne({ _id: id });

    if (podcastID) {
      if (Change >= 1) {
        console.log("first===========");
        podcastID.season += 1;
      } else {
        if (podcastID.season > 1) {
          console.log("first----------");
          podcastID.season -= 1;
        }
      }

      console.log(podcastID.season);

      await podcastID.save();
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

exports.createPodcast = createPodcast;
exports.podcastbyID = podcastbyID;
exports.seasonPodcast = seasonPodcast;
