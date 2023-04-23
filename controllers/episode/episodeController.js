const user = require("../../models/userSchema");
const HttpError = require("../../models/HttpError");
const podcast = require("../../models/podcastSchema");
const episode = require("../../models/episodeSchema");
const { check, validationResult } = require("express-validator");
const { getVideoDurationInSeconds } = require("get-video-duration");

// // Private || Create Podcast
// const createPodcast = async (req, res, next) => {
//   //   const errors = validationResult(req);
//   //   if (!errors.isEmpty()) {
//   //     return res.status(400).json({ errors: errors.array() });
//   //   }

//   const {
//     title,
//     des,
//     thumbnail,
//     // podcastIDBody,
//     season,
//   } = req.body;

//   console.table(req.body);

//   let podcastID;
//   try {
//     podcastID = await podcast.findOne({ _id: "6443501a3e7efdd37e79a980" });
//   } catch (err) {
//     console.log(err);
//     const error = new HttpError("Cannot add user", 400);
//     return next(error);
//   }

//   if (podcastID) {
//     let videosPaths = [];

//     if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
//       for (let video of req.files.videos) {
//         videosPaths.push("/" + video.path);
//       }
//     }

//     let link = {};
//     link.file = videosPaths;

//     const newEpisode = new episode({
//       title,
//       des,
//       thumbnail,
//       podcast,
//       season,
//       link,
//       type: "check",
//     });
//     try {
//       const createduser = await newEpisode.save();
//     } catch (err) {
//       console.log(err);
//       const error = new HttpError("Cannot add user", 400);
//       return next(error);
//     }
//   }

//   //   if (userE) {
//   //     const newPodcast = new podcast({
//   //       title,
//   //       des,
//   //       thumbnail,
//   //       year,
//   //       tag,
//   //       category,
//   //       author: userE._id,
//   //     });

//   //     try {
//   //       const createduser = await newPodcast.save();

//   //       return res.json({ state: "success" });
//   //     } catch (err) {
//   //       console.log(err);
//   //       const error = new HttpError("Cannot add user", 400);
//   //       return next(error);
//   //     }
//   //   }
// };

// Backendurl/public/videos/file_name.mp4
const createPodcast = async (req, res) => {
  const { title, des, thumbnail, podcastIDBody, season } = req.body;

  console.table(req.body);

  let videosPaths = [];

  if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
    for (let video of req.files.videos) {
      videosPaths.push("/" + video.path);
    }
  }

  // let thumbnailPaths = [];

  // if (Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
  //   for (let video of req.files.thumbnail) {
  //     thumbnailPaths.push("/" + video.path);
  //   }
  // }

  try {
    // getVideoDurationInSeconds(videosPaths).then((duration) => {
    //   console.log(duration);
    // });

    const createdMedia = await episode.create({
      title,
      des,
      thumbnail,
      podcastIDBody,
      season,
      videos: videosPaths,
    });

    let episodeID = await episode.findOne({ videos: videosPaths });
    let podcastID = await podcast.findOne({ _id: podcastIDBody });

    console.log(episodeID._id);
    console.log("podcastID.episodes");

    if (podcastID.episodes.length === 0) {
      console.log("+Add ---- - ----");
      podcastID.episodes = episodeID._id;
      await podcastID.save();
    } else {
      console.log("Push ---- - ----");
      let add = await podcast.findOneAndUpdate(
        { _id: podcastIDBody },
        {
          $push: {
            episodes: episodeID._id,
          },
        }
      );
    }

    res.json({ message: "Media created successfully", createdMedia });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// Private ||
const editThumbnail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { episodeID, thumbnail } = req.body;

  try {
    let episodeData = episode.findOne({ _id: episodeID });
    if (episodeData) {
      episodeData.thumbnail = thumbnail;

      await episodeData.save();
    } else {
      return res.status(202).json({ state: false });
    }
  } catch (err) {
    const error = new HttpError("User not found", 500);
    return next(error);
  }
};

const epByID = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  console.log(id);

  try {
    let episodeID = await episode.findOne({ _id: id });

    console.log("episodeID");
    if (episodeID) {
      console.log(episodeID);
      return res.status(202).json(episodeID);
    }
  } catch (err) {
    const error = new HttpError("User not found", 500);
    return next(error);
  }
};

exports.createPodcast = createPodcast;
exports.editThumbnail = editThumbnail;
exports.epByID = epByID;
