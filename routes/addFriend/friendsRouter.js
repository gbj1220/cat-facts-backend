const express = require("express");
const router = express.Router();

const {
  createNewFriend,
  getFriendsList,
} = require("./controller/friendsController");

router.get("/get-friends-list", getFriendsList);

router.post("/create-new-friend", createNewFriend);

module.exports = router;
