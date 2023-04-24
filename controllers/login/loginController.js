const HttpError = require("../../models/HttpError");
const user = require("../../models/userSchema");
const podcast = require("../../models/podcastSchema");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");

// Public || New User Register
const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;

  let users;
  try {
    users = await user.findOne({ email: email });
    console.log(users);
  } catch (e) {
    const error = new HttpError("Wrong Email Credentials", 400);
    return next(error);
  }

  if (users) {
    res.json({ exists: true });
    return;
  } else {
    let avatar;
    try {
      avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    } catch (e) {
      const error = new HttpError("gravatar error", 400);
      return next(error);
    }

    const newUser = new user({
      name: name,
      email: email,
      password: password,
      avatar: avatar,
    });

    try {
      const createduser = await newUser.save();

      let token;

      try {
        token = jwt.sign(
          { userEmail: email, designation: "user" },
          process.env.JWT_SECRATE,
          { expiresIn: "3hr" }
        );
      } catch (err) {
        const error = new HttpError("Error logging user", 401);
        console.log(err);
        return next(error);
      }
      var userinfo = {
        name: name,
        email: email,
        password: password,
        avatar: avatar,
      };
      res.json({ exists: false, token: token, user: userinfo });
    } catch (err) {
      console.log(err);
      const error = new HttpError("Cannot add user", 400);
      return next(error);
    }
  }
};

// Public || Login User
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  var validateEmail;

  try {
    validateEmail = await user.findOne({ email });

    console.log(validateEmail);

    if (!validateEmail) {
      const error = new HttpError("Wrong credentials", 400);
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, validateEmail.password);

    if (!isMatch) {
      const error = new HttpError("Wrong credentials", 400);
      return next(error);
    }
    console.log("saveds :- " + validateEmail.password);
    let token;
    try {
      token = jwt.sign(
        {
          userEmail: validateEmail.email,
        },
        process.env.JWT_SECRATE,
        { expiresIn: "3hr" }
      );
    } catch (err) {
      const error = new HttpError("Error error generating token", 401);
      console.log(err);
      return next(error);
    }

    res.status(200).json({ success: true, token: token, user: validateEmail });
  } catch (e) {
    const error = new HttpError("User not found", 500);
    return next(error);
  }
};

// Private || Add subscribe
const subscribeID = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  try {
    const userID = await user.findOne({ email: res.locals.userData.userEmail });

    if (userID) {
      if (userID.podcast.length > 0) {
        console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");

        let padcatSuvAlready = await user.findOne({
          "podcast.$.podcastID": id,
        });

        if (padcatSuvAlready) {
          return res.status(400).json({ exists: true });
        } else {
          console.log("+Add ---- - ---- true");

          let podcastdataSend = {};
          podcastdataSend.podcastID = id;
          podcastdataSend.subscribed = true;

          console.log(podcastdataSend);
          console.table(podcastdataSend);

          let add = await user.findOneAndUpdate(
            { email: res.locals.userData.userEmail },
            {
              $push: {
                podcast: podcastdataSend,
              },
            }
          );

          let padcastFind = await podcast.findOne({
            _id: id,
          });

          let addP;
          if (padcastFind) {
            addP = await podcast.findOneAndUpdate(
              { _id: id },
              {
                $set: {
                  subscribe: padcastFind.subscribe + 1,
                },
              }
            );
          }

          return res.status(200).json({ state: "success", addP });
        }
      } else {
        console.log("+Add ---- - ----");

        let podcastdataSend = {};
        podcastdataSend.podcastID = id;
        podcastdataSend.subscribed = true;

        console.log(podcastdataSend);
        console.table(podcastdataSend);

        let add = await user.findOneAndUpdate(
          { email: res.locals.userData.userEmail },
          {
            $push: {
              podcast: podcastdataSend,
            },
          }
        );

        let padcastFind = await podcast.findOne({
          _id: id,
        });

        let addP;
        if (padcastFind) {
          addP = await podcast.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                subscribe: padcastFind.subscribe + 1,
              },
            }
          );
        }

        return res.status(200).json({ state: "success", addP });
      }
    } else {
      return res.status(404).json("No User");
    }
  } catch (err) {
    const error = new HttpError("Error error generating token", 401);
    console.log(err);
    return next(error);
  }
};

// Private || Remove subscribe
const unSubscribe = async (req, res, next) => {
  console.log("___________________________________");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  try {
    const userID = await user.findOne({ email: res.locals.userData.userEmail });

    console.log(userID);
    if (userID) {
      let add = await user.findOneAndUpdate(
        { email: res.locals.userData.userEmail, "podcast.podcastID": id },
        {
          $set: {
            "podcast.$.subscribed": false,
          },
        }
      );
      let padcastFind = await podcast.findOne({
        _id: id,
      });

      let addP;
      if (padcastFind && padcastFind.subscribe > 0) {
        addP = await podcast.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              subscribe: padcastFind.subscribe - 1,
            },
          }
        );
        return res.status(202).json({ exists: true, userID });
      } else {
        return res.status(202).json({ exists: false });
      }

      console.log("padcastFind ---------- ---------- -----------");
      console.log(padcastFind);
    }
    return res.status(400).json({ exists: false });
  } catch (err) {
    const error = new HttpError("Error error generating token", 401);
    console.log(err);
    return next(error);
  }

  console.log(first);
};

// Private || Rating
const Rating = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, rating } = req.body;

  try {
    const userID = await user.findOne({
      email: res.locals.userData.userEmail,
      "podcast.podcastID": id,
    });

    if (userID) {
      let add = await user.findOneAndUpdate(
        { email: res.locals.userData.userEmail, "podcast.podcastID": id },
        {
          $set: {
            "podcast.$.rating": rating,
          },
        }
      );

      const podcastIDData = await podcast.findOne({
        _id: id,
      });

      var totalrating = podcastIDData.totalrating;

      let newR =
        (podcastIDData.rating * podcastIDData.totalrating + rating) /
        (podcastIDData.totalrating + 1);

      podcastIDData.rating = newR;
      podcastIDData.totalrating = totalrating + 1;

      await podcastIDData.save();
      console.log(newR);

      return res.status(202).json({ msg: "User Rating Added", podcastIDData });
    } else {
      return res.status(304).json("No user found");
    }
  } catch (err) {
    const error = new HttpError("Error error generating token", 401);
    console.log(err);
    return next(error);
  }
};

//
const createdPodcast = async (req, res, next) => {
  try {
    const userID = await user
      .findOne({ email: res.locals.userData.userEmail })
      .populate("createdPodcast");

    res.status(202).json(userID.createdPodcast);
  } catch (err) {
    const error = new HttpError("Error error generating token", 401);
    console.log(err);
    return next(error);
  }
};

// Private || Update User
const UpdateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, bio } = req.body;

  try {
    const userID = await user.findOne({
      email: res.locals.userData.userEmail,
    });

    if (userID) {
      userID.name = name;
      userID.bio = bio;

      await userID.save();
    }

    return res.status(202).json({ state: "User", userID });
  } catch (err) {
    const error = new HttpError("Error error generating token", 401);
    console.log(err);
    return next(error);
  }
};

const subData = async (req, res, next) => {
  console.log(
    "-------------------------------------------------------------------------------------"
  );
  console.log(
    "-------------------------------------------------------------------------------------"
  );
  console.log(
    "-------------------------------------------------------------------------------------"
  );
  try {
    const userID = await user.findOne({
      email: res.locals.userData.userEmail,
    });

    let reqData = userID.podcast.filter((e) => {
      if (e.subscribed === true) {
        return e;
      }
    });

    console.log("reqData==================");
    console.log(reqData);

    return res.status(202).json({ state: "found", reqData });
  } catch (err) {
    const error = new HttpError("Error error generating token", 401);
    console.log(err);
    return next(error);
  }
};

// Private || check sub
const checkSub = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(res.locals.userData.userEmail);

  const { id } = req.body;

  console.log(id);

  try {
    const userID = await user.findOne({
      email: res.locals.userData.userEmail,
      "podcast.podcastID": id,
    });

    if (userID) {
      return res.status(202).json({ state: true });
    } else {
      return res.status(202).json({ state: false });
    }
  } catch (err) {
    const error = new HttpError("Error error generating token", 401);
    console.log(err);
    return next(error);
  }
};

exports.login = login;
exports.Rating = Rating;
exports.subData = subData;
exports.register = register;
exports.checkSub = checkSub;
exports.UpdateUser = UpdateUser;
exports.unSubscribe = unSubscribe;
exports.subscribeID = subscribeID;
exports.createdPodcast = createdPodcast;
