const express = require('express');
const bodyParser = require('body-parser');
const session = require('./db');
const { postUser, getUsers, getAccessCode } = require('./users');

const app = express();
app.use(bodyParser.json());
// app.use("/", (req, res) => {
//     res.send("Server is running")
// })

session
    .run('CREATE CONSTRAINT user_is_unique IF NOT EXISTS FOR (u:User) REQUIRE u.name IS UNIQUE')
    .then(result => console.log('Created user constraint'))
    .catch(err => console.log(err));

// USERS
app.post("/users", postUser);
app.get("/users", getUsers);

app.post("/users/accessCodes", getAccessCode);

// POSTS




app.listen(5000, console.log('Server started'));

process.on('exit', function() {
    driver.close();
});



