require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rishavrajcrj:LwiNgEuISXBZVbfL@cluster0.upi0axf.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
      }
    );
    console.log("DataBase Connected");
  } catch (error) {
    console.log("Error");
    console.log(error);
  }
};

module.exports = connectDB;
