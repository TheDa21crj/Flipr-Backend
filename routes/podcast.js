const express = require("express");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");
const podcastController = require("../controllers/podcast/podcastController");

const router = express.Router();

router.post(
  "/podcastbyID",
  [check("id", "id is Required").not().isEmpty()],
  podcastController.podcastbyID
);

// auth
router.use(auth);

// Private || Create Podcast
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
