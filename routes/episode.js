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
  [check("podcast", "podcast is Required").not().isEmpty()],
  [check("season", "season is Required").not().isEmpty()],
  episodeController.createPodcast
);

module.exports = router;
