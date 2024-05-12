const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, "nakul", (err, decode) => {
      // (err, decode) means that, there will be error or the token will be decoded
      if (err) {
        return res.status(400).send({
          success: false,
          message: "Unauthorized User",
        });
      } else {
        // console.log(req.body);
        req.body.userid = decode.userid;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Please Provide Auth Token",
      error: error.message,
    });
  }
};

module.exports = { authMiddleware };
