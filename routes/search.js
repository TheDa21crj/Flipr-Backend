const express = require("express");
const searchController = require("../controllers/search/searchController");
const auth = require("./../middleWare/auth");
// const { check } = require("express-validator");

const router = express.Router();

// auth
router.use(auth);

// Search
router.get("/", searchController.searchData);

// Search
router.get("/leeterwise", searchController.searchData);

module.exports = router;
