const user = require("../../models/userSchema");
const HttpError = require("../../models/HttpError");
const podcast = require("../../models/podcastSchema");
const { check, validationResult } = require("express-validator");

//Public || Podcast by Podcast ID
const searchData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { query } = req.body;

  try {
  } catch (err) {
    console.log(err);
    const error = new HttpError("Server Error", 400);
    return next(error);
  }
};

exports.searchData = searchData;
