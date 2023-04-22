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

  const { title, des, thumbnail, year, podcast, season } = req.body;

  let podcastID;
  try {
    podcastID = await podcast.findOne({ _id: podcast });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Cannot add user", 400);
    return next(error);
  }

  if (podcastID) {
    const newEpisode = new episode({
      title,
      des,
      thumbnail,
      podcast,
      season,
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
