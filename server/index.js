const express = require('express')
const app = express()

// app.use("/", (req, res) => {
//     res.send("Server is running")
// })

app.use("/test", (req, res) => {
    res.send("test")
})

app.listen(5000, console.log("Server started on port 5000"));