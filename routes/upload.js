const express = require("express");
const mediaController = require("./../controllers/mediaController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// auth
router.use(auth);

// Private || Create Podcast
router.post(
  "/",
  [check("email", "email is Required").not().isEmpty()],
  userController.getUser
);

module.exports = router;
