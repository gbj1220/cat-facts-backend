const bcrypt = require("bcryptjs");
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
      console.log(e);
      res.status(500).json(mongoDBErrorParser(e));
    }
  },
};
