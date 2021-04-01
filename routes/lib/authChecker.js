const jwt = require("jsonwebtoken");
const mongoDBErrorParser = require("./mongoDBErrorParser");

const checkForValidToken = async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      const jwtToken = req.headers.authorization.slice(7);
      const decodedJWT = jwt.verify(jwtToken, process.env.JWT_VERY_SECRET);
      if (decodedJWT) {
        next();
      }
    } else {
      throw {
        message: "You do not have permissions. Please sign in to continue.",
      };
    }
  } catch (e) {
    res.status(500).json(mongoDBErrorParser(e));
  }
};

module.exports = {
  checkForValidToken,
};
