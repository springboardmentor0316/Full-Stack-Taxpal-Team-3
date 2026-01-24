const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware.js");

const {
  getUsers,
  registration,
  login,
  // verifyLoginOtp,
  resendLoginOtp,
  forgotPassword,
  resetPassword,
  verifyEmailOtp,
  verifyResetOtp,
} = require("../controllers/userController.js");

router.get("/", verifyToken, getUsers);

router.post("/login", login);
router.post("/verify-login-otp", verifyEmailOtp);
router.post("/resend-login-otp", resendLoginOtp);
router.post("/register", registration);
router.post("/verify-reset-otp", verifyResetOtp);


// Forgot password -> generates token
router.post("/forgot-password", forgotPassword);

// Reset password -> must include token in URL
router.post("/reset-password", resetPassword);

module.exports = router;