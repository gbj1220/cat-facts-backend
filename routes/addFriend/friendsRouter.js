const express = require("express");
const router = express.Router();

const {
  createNewFriend,
  getFriendsList,
  deleteFriendById,
} = require("./controller/friendsController");

router.get("/get-friends-list", getFriendsList);

router.post("/create-new-friend", createNewFriend);

router.delete("/delete-friend/:id", deleteFriendById);

module.exports = router;
