const user = require("../../models/userSchema");
const HttpError = require("../../models/HttpError");
const podcast = require("../../models/podcastSchema");
const { check, validationResult } = require("express-validator");

//Public || Podcast by Podcast ID
const searchData = async (req, res, next) => {
  const query = req.query.q;

  console.log(query);

  try {
    const records = await podcast.find({ $text: { $search: query } });
    res.status(202).json(records);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Server Error", 400);
    return next(error);
  }
};

//Public || Podcast by Podcast ID
const searchLetterData = async (req, res, next) => {
  const query = req.params.query;

  console.log(query);

  try {
    const result = await podcast.find({
      title: { $regex: query, $options: "i" },
    });
    res.json(result);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Server Error", 400);
    return next(error);
  }
};

exports.searchData = searchData;
exports.searchLetterData = searchLetterData;
