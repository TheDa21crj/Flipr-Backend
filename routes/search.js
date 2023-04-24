const express = require("express");
const searchController = require("../controllers/search/searchController");
const auth = require("./../middleWare/auth");
// const { check } = require("express-validator");

const router = express.Router();

// Search
router.get("/", searchController.searchData);

// Search
router.get("/leeterwise/:query", searchController.searchLetterData);

module.exports = router;
