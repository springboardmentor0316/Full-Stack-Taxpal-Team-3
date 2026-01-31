const express = require('express')
require("dotenv").config();

// create the object of the express server
const app = express()
const userRoutes = require('./routes/userRoutes')
const cors = require("cors")
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });


//reads json
app.use(express.json())

app.use(cors())

app.get("/", (req, res) => {
    res.send("TaxPal backend is running 🚀")
  })


//routes
app.use('/api/users', userRoutes)
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Something went wrong" })
})
// start the server on the port
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`)
})
console.log("MONGO_URI =", process.env.MONGO_URI);
