const express = require("express");
const router = express.Router();
const loginController = require("../controllers/search/searchController");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");
