const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    }
  },

  login: async (req, res) => {
    try {
      let foundUser = await User.findOne({ email: req.body.email });

      if (!foundUser) {
        throw { message: "Please register your email to login." };
      }

      let comparedPassword = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (!comparedPassword) {
        throw { message: "Email is not registered. Please register to login." };
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
    }
  },

  sendEmail: async (req, res) => {
    "use strict";
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gepflue@gwenbd94.com",
        pass: "",
      },
    });

    const mailOptions = {
      from: "gepflue@gwenbd94.com",
      to: "gregory.johnson@code-immersives.com",
      subject: "Sending Email using Node.js",
      text: "That was easy!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};
