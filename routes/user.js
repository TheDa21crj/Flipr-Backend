const express = require("express");
const router = express.Router();
// const userController = require("../controllers/user/userController");
const loginController = require("../controllers/login/loginController");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

// Public || Get Register User
router.post(
  "/signup",
  [check("name", "name is Required").not().isEmpty()],
  [check("email", "email is Required").not().isEmpty()],
  [check("password", "password is Required").not().isEmpty()],
  loginController.register
);

// Public || Get Login User
router.post(
  "/Login",
  [check("email", "email is Required").not().isEmpty()],
  [check("password", "password is Required").not().isEmpty()],
  loginController.login
);

// auth
router.use(auth);

// Public || Add subscribe
router.post(
  "/subscribe",
  [check("id", "id is Required").not().isEmpty()],
  loginController.subscribeID
);

// Private || Add Rating
router.post(
  "/Rating",
  [check("id", "id is Required").not().isEmpty()],
  [check("rating", "rating is Required").not().isEmpty()],
  loginController.Rating
);

// Public || Add Rating
router.get("/createdPodcast", loginController.createdPodcast);

module.exports = router;
