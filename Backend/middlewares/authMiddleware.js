const jwt = require("jsonwebtoken")
const config = require("../utils/config")

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" })
    }

    // Expected format: "Bearer <token>"
    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, config.secret)

    // attach decoded payload to request
    req.user = decoded

    next() // move to next middleware / controller
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

module.exports = verifyToken
