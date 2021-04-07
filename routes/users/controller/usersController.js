const NewFriend = require("../../addFriend/model/NewFriend");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const User = require("../model/User");
const mongoDBErrorParser = require("../../lib/mongoDBErrorParser");

module.exports = {
  signUp: async (req, res) => {
    try {
      let salted = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(req.body.password, salted);

      const { firstName, lastName, email } = req.body;

      let createdUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      let savedUser = await createdUser.save();

      res.json({
        data: savedUser,
      });
    } catch (e) {
      res.status(500).json(mongoDBErrorParser(e));
      console.log("backend-------36");
    }
  },

  login: async (req, res) => {
    try {
      let foundUser = await User.findOne({ email: req.body.email });

      if (!foundUser) {
        throw {
          message:
            "Email is not registered. Please sign up to create an account.",
        };
      }

      let comparedPassword = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (!comparedPassword) {
        throw {
          message: "Password is incorrect. Please try again.",
        };
      } else {
        let jwtToken = jwt.sign(
          {
            email: foundUser.email,
          },
          process.env.JWT_VERY_SECRET,
          { expiresIn: "8h" }
        );

        res.json({
          jwtToken: jwtToken,
        });
      }
    } catch (e) {
      res.status(500).json(mongoDBErrorParser(e));
      console.log("backend-------70");
    }
  },

  sendSMS: async (req, res) => {
    console.log("-------");
    console.log(req.body.friendsInfo.mobileNumber);

    try {
      const sentSMS = await client.messages.create({
        body: `Thank you for subscribing to CatFacts ${req.body.friendsInfo.firstName}! Here is your daily CatFact... ${req.body.oneCatFact}`,
        from: "+14787969053",
        to: req.body.friendsInfo.mobileNumber,
      });
      console.log("Message Sent!");
      res.json(sentSMS);
    } catch (e) {
      console.log(e);
      res.status(500).json(mongoDBErrorParser(e));
    }
  },
};
