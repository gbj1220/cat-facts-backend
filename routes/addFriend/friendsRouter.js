const express = require("express");
const router = express.Router();

const { createNewFriend } = require("./controller/friendsController");

router.post("/create-new-friend", createNewFriend);
