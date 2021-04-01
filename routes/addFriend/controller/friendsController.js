const NewFriend = require("../model/NewFriend/");
const User = require("../../users/model/User");
const mongoDBErrorParser = require("../../lib/mongoDBErrorParser");
const jwt = require("jsonwebtoken");

const createNewFriend = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const newFriend = await new NewFriend({
      firstName,
      lastName,
      email,
    });

    const savedNewFriend = await newFriend.save();

    const token = req.headers.authorization.slice(7);

    const decodedToken = jwt.verify(token, process.env.JWT_VERY_SECRET);

    const targetUser = await User.findOne({ email: decodedToken.email });

    targetUser.friends.push(savedNewFriend._id);

    await targetUser.save();
  } catch (e) {
    res.status(500).json(mongoDBErrorParser(e));
  }
};

module.exports = {
  createNewFriend,
};
