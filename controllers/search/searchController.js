const user = require("../../models/userSchema");
const HttpError = require("../../models/HttpError");
const podcast = require("../../models/podcastSchema");
const { check, validationResult } = require("express-validator");

//Public || Podcast by Podcast ID
const searchData = async (req, res, next) => {
  const { query } = req.query.q;

  try {
    // Search the database for matching records
    podcast.find({ $text: { $search: query } }, function (err, records) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Return the matching records
      res.json(records);
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Server Error", 400);
    return next(error);
  }
};

exports.searchData = searchData;
