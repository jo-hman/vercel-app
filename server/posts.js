const session = require("./db");

function extractPostProperties(records) {
    let resultTable = [];

    records.forEach(record => {
        if (record._fields && Array.isArray(record._fields)) {
            record._fields.forEach(field => {
                if (field.properties) {
                    resultTable.push({ id: field.properties.id, title: field.properties.title, content: field.properties.content });
                }
            });
        }
    });

    return resultTable;
}

const postPost = (req, res) => {
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
            res.status(500).send();
        });
}

const getPosts = (req, res) => {
    if (req.query.user) {
        session
            .run('MATCH (user:User {name: $name})-[:POSTED]->(post:Post) RETURN post', { name: req.query.user })
            .then(result => {
                console.log('Get posts with query user param', result.records);
                res.send(extractPostProperties(result.records));
            })
            .catch(err => {
                console.log(err);
                res.status(500).send();
            });
    } else {
        session
            .run('MATCH (p:Post) RETURN p;')
            .then(result => {
                console.log('Get posts ', result.records);
                res.send(extractPostProperties(result.records));
            })
            .catch(err => {
                console.log(err);
                res.status(500).send();
            });
    }
}

module.exports = {
    postPost: postPost,
    getPosts: getPosts
};