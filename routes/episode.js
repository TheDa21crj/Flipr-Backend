const express = require("express");
const router = express.Router();
const auth = require("./../middleWare/auth");
const mediaController = require("./../controllers/episode/episodeController");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

    if (ext !== ".mkv" && ext !== ".mp4" && ext !== ".mp3" && ext !== ".mov") {
      return cb(new Error("Only videos and audio are allowed!"));
    }
    cb(null, true);
  },
});

// auth
router.use(auth);

//get all media
// router.get("/all", mediaController.getAll);

// Private || Post Create New
router.post(
  "/create",
  upload.fields([
    {
      name: "videos",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  mediaController.createPodcast
);

module.exports = router;
