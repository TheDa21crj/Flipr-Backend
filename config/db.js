require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(process.env.mongoURL);
    await mongoose.connect(process.env.mongoURL, {
      useNewUrlParser: true,
    });
    console.log("DataBase Connected");
  } catch (error) {
    console.log("Error");
    console.log(error);
  }
};

module.exports = connectDB;
