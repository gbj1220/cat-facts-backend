const express = require("express");
const router = express.Router();

const { signUp, login } = require("./controller/usersController");

const {
  checkIfInputIsEmpty,
  checkForSymbolsMiddleWare,
  checkIfLoginIsEmpty,
} = require("../lib/validator");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;

router.post("/sign-up", checkIfInputIsEmpty, checkForSymbolsMiddleWare, signUp);

router.post("/login", checkIfLoginIsEmpty, login);
