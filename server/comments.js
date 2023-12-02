const session = require("./db");

function extractCommentProperties(records) {
    let resultTable = [];

    records.forEach(record => {
        if (record._fields && Array.isArray(record._fields)) {

            resultTable.push({ name: record._fields[0].properties.name, text: record._fields[1].properties.text });

        }
    });

    return resultTable;
}


const postComment = (req, res) => {
    session
        .run('MATCH (user:User {name: $userName}) MATCH (post:Post {id: $postId}) CREATE (user)-[:COMMENTED]->(comment:Comment {text: $commentText}) CREATE (comment)-[:UNDER]->(post) RETURN user, post, comment',
             { userName: req.body.name, postId: req.params.id, commentText: req.body.commentText })
        .then(result => {
            if (result.records[0] === undefined) {
                res.status(400).send();
            } else {
                console.log('User added a comment', result);
                res.send();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
}

const getComments = (req, res) => {
    session
        .run('MATCH (user:User)-[:COMMENTED]->(comment:Comment)-[:UNDER]->(post:Post {id: $postId}) RETURN user, comment, post', { postId: req.params.id })
        .then(result => {
            console.log('Get comments', result);

            res.send(extractCommentProperties(result.records));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
}


module.exports = {
    postComment: postComment,
    getComments: getComments
}