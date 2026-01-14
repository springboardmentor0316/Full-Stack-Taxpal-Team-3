//bcrypt for password hashing

const bcrypt = require("bcrypt")
const config = require("./config")

//hashes password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.saltRound)
}
//compares hashed password and entered password at login
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

module.exports = { hashPassword, comparePassword }
