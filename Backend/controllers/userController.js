//user controller -> contains logic to access db 

const User = require("../models/User")
const { hashPassword, comparePassword } = require("../utils/auth")
const config = require("../utils/config")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const generateSixDigitOtp = () => {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0")
}

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(String(otp)).digest("hex")
}

const issueJwt = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    config.secret,
    { expiresIn: "1h" }
  )
}
//fetches all userss
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message })
  }
}

//signup / registration function
exports.registration = async (req, res) =>{
  try{
    const { name, email, password, country, income_bracket } = req.body

    //1. validations basic
    if (!name || !email || !password) {
      return res.status(400).json({  // 400- bad request
        message: "Name, email and password are required"
      })
    }

    //2. checking for exixting users -> find by email id (unique)
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ //409 - conflict (duplicate entry or already exixting data)
        message: "User already exists"
      })
    }

    // 3. Create new user
    /* // without bcrypt
    const user = await User.create({
      name,
      email,
      password,
      country,
      income_bracket
    })
      */

    //with bcrypt
    const hashedPassword = await hashPassword(password)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      country,
      income_bracket
    })

    // 4. Success response
    res.status(201).json({ // sc 201 -> resourse created 
      message: "Registration successful",
      userId: user._id
    })

  }
  catch(error){
    res.status(500).json({ // 500- internal server error
      message: "registration failed",
      error : error.message
    })
  }
}


//sign-in / login function 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // 2. Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // 3. Check password (plain comparison)
    /* //without bcrypt
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    */
    // 3. Check password (bcrypt comparison)
    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // If email isn't verified yet, send OTP and block login until verified
    if (!user.isEmailVerified) {
      const otp = generateSixDigitOtp()
      user.loginOtpHash = hashOtp(otp)
      user.loginOtpExpire = Date.now() + (config.otpExpireMinutes || 10) * 60 * 1000
      await user.save()

      // In production, send OTP via email/SMS. For now we optionally return it for dev.
      const payload = {
        message: "OTP sent to your email. Please verify to continue.",
        requiresOtp: true,
        email: user.email,
        userId: user._id
      }

      if (config.exposeOtpInResponse) {
        payload.otp = otp
      }

      return res.status(200).json(payload)
    }

    // 4. Generate JWT token
    const token = issueJwt(user)

    // 5. Success
    res.json({
      message: "Login successful",
      token,
      userId: user._id
    })

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isEmailVerified) {
      const token = issueJwt(user)
      return res.status(200).json({ message: "Already verified", token, userId: user._id })
    }

    if (!user.loginOtpHash || !user.loginOtpExpire) {
      return res.status(400).json({ message: "OTP not requested. Please login again." })
    }

    if (user.loginOtpExpire.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Please request a new OTP." })
    }

    const incomingHash = hashOtp(otp)
    if (incomingHash !== user.loginOtpHash) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    user.isEmailVerified = true
    user.loginOtpHash = undefined
    user.loginOtpExpire = undefined
    await user.save()

    const token = issueJwt(user)
    return res.status(200).json({ message: "OTP verified", token, userId: user._id })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.resendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "User is already verified" })
    }

    const otp = generateSixDigitOtp()
    user.loginOtpHash = hashOtp(otp)
    user.loginOtpExpire = Date.now() + (config.otpExpireMinutes || 10) * 60 * 1000
    await user.save()

    const payload = {
      message: "OTP resent to your email",
      requiresOtp: true,
      email: user.email,
      userId: user._id
    }

    if (config.exposeOtpInResponse) {
      payload.otp = otp
    }

    return res.status(200).json(payload)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}











exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")

    // Hash token & save to DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000 // 15 minutes

    await user.save()

    res.status(200).json({
      message: "Password reset token generated",
      resetToken   // In production, send via email
    })

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
 

exports.resetPassword = async (req, res) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }

    user.password = await hashPassword(req.body.password);

    // clear reset token after success
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};