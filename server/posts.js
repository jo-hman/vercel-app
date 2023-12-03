const driver = require("./db");

function extractPostProperties(records) {
    let resultTable = [];

    records.forEach(record => {
        if (record._fields && Array.isArray(record._fields)) {

            resultTable.push({ name: record._fields[0].properties.name, id: record._fields[1].properties.id , title: record._fields[1].properties.title, content: record._fields[1].properties.content });

        }
    });


    return resultTable;
}

const postPost = (req, res) => {
    const session = driver.session();

    session
        .run('MATCH (user:User {name: $name}) CREATE (user)-[:POSTED]->(post:Post {id: $postId, title: $postTitle, content: $postContent}) RETURN user, post',
             { name: req.body.name, postId: Math.random().toString(16).slice(2), postTitle: req.body.postTitle, postContent: req.body.postContent })
        .then(result => {
            if (result.records[0] === undefined) {
                res.status(400).send();
            } else {
                console.log('User added a post', result);
                res.send();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).send();
        });
}

const getPosts = (req, res) => {
    const session = driver.session();

    session
        .run('MATCH (user:User)-[:POSTED]->(post:Post) RETURN user, post')
        .then(result => {
            console.log('Get users posts', result.records);
            res.send(extractPostProperties(result.records));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
    
}

const deletePost = (req, res) => {
    const session = driver.session();

    session
        .run('MATCH (post:Post {id: $postId}) DETACH DELETE post', { postId: req.params.id })
        .then(result => {
                console.log('User deleted a post', result);
                res.send();
        })
        .catch(err => {
            console.log(err);
            res.status(404).send();
        });
}

module.exports = {
    postPost: postPost,
    getPosts: getPosts,
    deletePost: deletePost
};