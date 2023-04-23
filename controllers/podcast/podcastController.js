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
      type: "audio",
      thumbnail: videosPaths,
      year: new Date().getFullYear(),
      tag,
      category,
      author: userE._id,
    });

    try {
      const createduser = await newPodcast.save();

      let newPodcastCreated = await podcast.find({ thumbnail: videosPaths });

      console.log("newPodcastCreated==========");
      console.log(newPodcastCreated);

      userE.createdPodcast = newPodcast._id;

      await userE.save();

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
      if (Change === 1) {
        podcastID.season += 1;
      } else if (Change === 0) {
        if (podcastID.season > 1) {
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

//Public || Podcast by Trending
const podcastTrending = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type } = req.body;

  console.log("==============");
  console.log(type);

  try {
    let podcastID = await podcast.find({ type }).sort({ date: 1 }).limit(10);
    return res.status(202).json(podcastID);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error", 400);
    return next(error);
  }
};

// Public || Podcast by Trending
const podcastAll = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type } = req.body;

  console.log("==============");
  console.log(type);

  try {
    let podcastID = await podcast.find({ type });
    return res.status(202).json(podcastID);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error", 400);
    return next(error);
  }
};

// Public || Podcast by Trending
const podcastAllType = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type } = req.body;

  console.log("==============");
  console.log(type);

  try {
    let podcastID = await podcast.find();
    return res.status(202).json(podcastID);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error", 400);
    return next(error);
  }
};

exports.podcastAll = podcastAll;
exports.podcastbyID = podcastbyID;
exports.seasonPodcast = seasonPodcast;
exports.createPodcast = createPodcast;
exports.podcastAllType = podcastAllType;
exports.podcastTrending = podcastTrending;
