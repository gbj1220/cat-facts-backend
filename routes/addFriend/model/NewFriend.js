const { text } = require("express");
const mongoose = require("mongoose");

const NewFriendSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },

  lastName: {
    type: String,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    trim: true,
    required: true,
  },

  text: {
    type: String,
  },
});

module.exports = mongoose.model("newFriend", NewFriendSchema);
