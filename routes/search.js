const express = require("express");
const searchController = require("../controllers/search/searchController");
const { check } = require("express-validator");

const router = express.Router();

// Search
router.get(
  "/searchData",
  [check("query", "query is Required").not().isEmpty()],
  searchController.searchData
);

module.exports = router;
