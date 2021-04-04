const NewFriend = require("../model/NewFriend");
const User = require("../../users/model/User");
const mongoDBErrorParser = require("../../lib/mongoDBErrorParser");
const jwt = require("jsonwebtoken");

const createNewFriend = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber } = req.body;

    const newFriend = await new NewFriend({
      firstName,
      lastName,
      mobileNumber,
    });

    const savedNewFriend = await newFriend.save();

    const token = req.headers.authorization.slice(7);

    const decodedToken = jwt.verify(token, process.env.JWT_VERY_SECRET);

    const targetUser = await User.findOne({ email: decodedToken.email });

    targetUser.friends.push(savedNewFriend._id);

    await targetUser.save();

    res.json(savedNewFriend);
  } catch (e) {
    res.status(500).json(mongoDBErrorParser(e));
  }
};

const getFriendsList = async (req, res) => {
  try {
    let jwtToken = req.headers.authorization.slice(7);

    let decodedToken = jwt.verify(jwtToken, process.env.JWT_VERY_SECRET);

    const payload = await User.findOne({ email: decodedToken.email })
      .populate({
        path: "friends",
        model: NewFriend,
        select: "-_id -__v",
      })
      .select("-email -password -firstName -lastName -__v -_id");
    console.log(payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json(mongoDBErrorParser(e));
  }
};

module.exports = {
  createNewFriend,
  getFriendsList,
};
