const user = require("../../models/userSchema");
const HttpError = require("../../models/HttpError");
const podcast = require("../../models/podcastSchema");
const episode = require("../../models/episodeSchema");
const { check, validationResult } = require("express-validator");

// Private || Create Podcast
const createPodcast = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, des, thumbnail, podcastIDBody, season } = req.body;

  let podcastID;
  try {
    podcastID = await podcast.findOne({ _id: podcastIDBody });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Cannot add user", 400);
    return next(error);
  }

  if (podcastID) {
    let videosPaths = [];

    if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
      for (let video of req.files.videos) {
        videosPaths.push("/" + video.path);
      }
    }

    let link = {};
    link.file = videosPaths;

    const newEpisode = new episode({
      title,
      des,
      thumbnail,
      podcast,
      season,
      link,
      type: "check",
    });
    try {
      const createduser = await newEpisode.save();
    } catch (err) {
      console.log(err);
      const error = new HttpError("Cannot add user", 400);
      return next(error);
    }
  }

  //   if (userE) {
  //     const newPodcast = new podcast({
  //       title,
  //       des,
  //       thumbnail,
  //       year,
  //       tag,
  //       category,
  //       author: userE._id,
  //     });

  //     try {
  //       const createduser = await newPodcast.save();

  //       return res.json({ state: "success" });
  //     } catch (err) {
  //       console.log(err);
  //       const error = new HttpError("Cannot add user", 400);
  //       return next(error);
  //     }
  //   }
};

exports.createPodcast = createPodcast;
