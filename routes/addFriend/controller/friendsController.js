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

    res.json(targetUser);
  } catch (e) {
    res.status(500).json(mongoDBErrorParser(e));
  }
};

const getFriendsList = async (req, res) => {
  try {
    const jwtToken = req.headers.authorization.slice(7);

    const decodedToken = jwt.verify(jwtToken, process.env.JWT_VERY_SECRET);

    const payload = await User.findOne({ email: decodedToken.email })
      .populate({
        path: "friends",
        model: "newFriend",
        select: " -__v",
      })
      .select("-email -password -firstName -lastName -__v ");
    res.json(payload);
  } catch (e) {
    console.log(e.message);
    res.status(500).json(mongoDBErrorParser(e));
  }
};

const deleteFriendById = async (req, res) => {
  try {
    const deletedFriend = await NewFriend.findByIdAndDelete({
      _id: req.params.id,
    });

    const foundUser = await User.findOne({
      email: req.body.email,
    });

    const userFriendsArray = foundUser.friends;

    const newFriendArray = userFriendsArray.filter((item) => {
      if (item.toString() !== req.params.id) {
        return item;
      }
    });

    foundUser.friends = newFriendArray;

    await foundUser.save();

    res.json({
      Successfully_Deleted: deletedFriend,
    });
  } catch (e) {
    res.status(500).json(mongoDBErrorParser(e));
  }
};

module.exports = {
  createNewFriend,
  getFriendsList,
  deleteFriendById,
};
