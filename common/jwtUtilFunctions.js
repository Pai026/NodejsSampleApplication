var jwt = require("jsonwebtoken");
require("dotenv").config();
function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return {
        status: 500,
        auth: false,
        error: "Failed to authenticate token",
      };
    return {
      status: 200,
      decoded: decoded,
    };
  });
}

module.exports = { verifyToken };
