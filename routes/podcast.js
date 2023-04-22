const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const auth = require("../middleWare/auth");
const { check } = require("express-validator");
const podcastController = require("../controllers/podcast/podcastController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/podcast")) {
      fs.mkdirSync("public/podcast");
    }

    cb(null, "public/podcast");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext != ".png" && ext != ".jpeg" && ext != ".jpg") {
      return cb(new Error("Only videos and audio are allowed!"));
    }
    cb(null, true);
  },
});

// Public || Get Podcast by ID
router.get(
  "/podcastbyID",
  [check("id", "id is Required").not().isEmpty()],
  podcastController.podcastbyID
);

// Public || Trending
router.post(
  "/podcastTrending",
  [check("type", "type is Required").not().isEmpty()],
  podcastController.podcastTrending
);

// auth
router.use(auth);

// Private || Create Podcast
router.post(
  "/create",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  podcastController.createPodcast
);

router.post(
  "/season",
  [check("id", "id is Required").not().isEmpty()],
  [check("Change", "Change is Required").not().isEmpty()],
  podcastController.seasonPodcast
);

module.exports = router;
