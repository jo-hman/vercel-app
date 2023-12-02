const express = require('express')
const app = express()

app.use("/", (req, res) => {
    res.send("Server is running")
})

app.use("/costam", (req, res) => {
    res.send("costam")
})

app.listen(5000, console.log("Server started on port 5000"));