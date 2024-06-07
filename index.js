require("dotenv").config();
const express = require("express");
const app = express();
const userRoute = require("./src/user/route")
const port = process.env.PORT || 7000;

const config = require('./config/config')
app.use(express.urlencoded({ extended: true, limit: "500mb" }))
app.use(express.json({ extended: true, limit: "500mb" }))



app.use('/user/api/v1', userRoute)



app.listen(port, () => {
    console.log('Server started at PORT: ', port);
})

