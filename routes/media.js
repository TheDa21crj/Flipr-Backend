const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login/loginController");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

// auth
router.use(auth);

//get all media
router.get("/all", mediaController.getAll);

// Private || Post Create New
router.post(
  "/create",
  upload.fields([
    {
      name: "videos",
      maxCount: 5,
    },
  ]),
  mediaController.create
);

module.exports = router;
