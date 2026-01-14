//user controller -> contains logic to access db 

const User = require("../models/User")
const { hashPassword, comparePassword } = require("../utils/auth")
const config = require("../utils/config")
const jwt = require("jsonwebtoken")
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

    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.secret,
      { expiresIn: "1h" }
    )

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

