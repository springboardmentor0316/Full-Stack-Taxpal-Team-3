// db.js
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/taxpal_db")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err))

module.exports = mongoose