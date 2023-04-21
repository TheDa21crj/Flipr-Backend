const HttpError = require("../../models/HttpError");
const user = require("../../models/userSchema");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

// Private || Create Podcast
const createPodcast = async (req, res, next) => {};

exports.login = login;
exports.register = register;
