const express = require('express');
const bodyParser = require('body-parser');
const session = require('./db');
const { postUser, getUsers, getAccessCode } = require('./users');
const { postPost, getPosts } = require('./posts');
const { postComment, getComments } = require('./comments');

const app = express();
app.use(bodyParser.json());
// app.use("/", (req, res) => {
//     res.send("Server is running")
// })

session
    .run('CREATE CONSTRAINT user_is_unique IF NOT EXISTS FOR (u:User) REQUIRE u.name IS UNIQUE')
    .then(result => {
        session
            .run('CREATE CONSTRAINT postId_is_unique IF NOT EXISTS FOR (p:Post) REQUIRE p.id IS UNIQUE')
            .then(result => console.log('Created post constraint'))
            .catch(err => console.log(err));
        console.log('Created user constraint');
    })
    .catch(err => console.log(err));

// USERS 
app.post("/users", postUser);
app.get("/users", getUsers);
app.post("/users/accessCodes", getAccessCode);

// POSTS
app.post('/posts', postPost);
app.get('/posts', getPosts);

// COMMENTS
app.post('/posts/:id/comments', postComment);
app.get('/posts/:id/comments', getComments);



app.listen(5000, console.log('Server started'));

process.on('exit', function() {
    driver.close();
});



