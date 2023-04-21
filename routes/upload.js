const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login/loginController");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

// auth
router.use(auth);

// Private || Create Podcast
router.post(
  "/",
  [check("email", "email is Required").not().isEmpty()],
  userController.getUser
);

module.exports = router;
