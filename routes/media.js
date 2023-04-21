const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login/loginController");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/videos")) {
      fs.mkdirSync("public/videos");
    }

    cb(null, "public/videos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".mkv" && ext !== ".mp4") {
      return cb(new Error("Only videos are allowed!"));
    }

    cb(null, true);
  },
});

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
