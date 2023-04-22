const express = require("express");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");
const episodeController = require("../controllers/episode/episodeController");

const router = express.Router();

// auth
router.use(auth);

// Private || Create Episode
router.post(
  "/create",
  [check("title", "title is Required").not().isEmpty()],
  [check("des", "des is Required").not().isEmpty()],
  [check("thumbnail", "thumbnail is Required").not().isEmpty()],
  [check("year", "year is Required").not().isEmpty()],
  [check("tag", "tag is Required").not().isEmpty()],
  [check("category", "category is Required").not().isEmpty()],
  podcastController.createPodcast
);

module.exports = router;
