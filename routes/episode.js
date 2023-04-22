const express = require("express");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");
const episodeController = require("../controllers/episode/episodeController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/videos")) {
      fs.mkdirSync("public/videos");
    }

    cb(null, "public/videos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".mkv" && ext !== ".mp4" && ext !== ".mp3") {
      return cb(new Error("Only videos and audio are allowed!"));
    }
    cb(null, true);
  },
});

// auth
router.use(auth);

// Private || Create Episode
router.post(
  "/create",
  [check("title", "title is Required").not().isEmpty()],
  [check("des", "des is Required").not().isEmpty()],
  [check("thumbnail", "thumbnail is Required").not().isEmpty()],
  [check("podcast", "podcast is Required").not().isEmpty()],
  [check("season", "season is Required").not().isEmpty()],
  upload.fields([
    {
      name: "videos",
      maxCount: 1,
    },
  ]),
  episodeController.createPodcast
);

module.exports = router;
