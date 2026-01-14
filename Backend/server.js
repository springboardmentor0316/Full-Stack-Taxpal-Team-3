const express = require('express')
// create the object of the express server
const app = express()
const userRoutes = require('./routes/userRoutes')
const cors = require("cors")

//inits mongoDB connection
require('./utils/db')

//middlewares
//reads json
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("TaxPal backend is running 🚀")
  })

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Something went wrong" })
})

//routes
app.use('/api/users', userRoutes)


// start the server on the port
app.listen(4000, 'localhost', () => {
    console.log('server started at port 4000')
})