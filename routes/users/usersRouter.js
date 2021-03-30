const express = require("express");
const router = express.Router();

const { signUp } = require("./controller/usersController");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;

router.post("/sign-up", signUp);
