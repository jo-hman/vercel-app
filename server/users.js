const session = require("./db");
const jwt = require('jsonwebtoken');
const secret = 'secret';

function extractUserProperties(records) {
    let resultTable = [];

    records.forEach(record => {
        if (record._fields && Array.isArray(record._fields)) {
            record._fields.forEach(field => {
                if (field.properties) {
                    resultTable.push({ name: field.properties.name });
                }
            });
        }
    });

    return resultTable;
}

function createAccessCode(username, callback) {
    const expiresIn = '1h';

    jwt.sign({ name: username }, secret, { expiresIn }, (err, token) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, token);
        }
    });
}



const postUser = (req, res) => {
    session
        .run('CREATE (a:User {name: $name, password: $password}) RETURN a', { name: req.body.name, password: req.body.password})
        .then(result => {
            console.log('Added user ', result.records[0]._fields[0]);

            createAccessCode(req.body.name, (err, accessCode) => {
                if (err) {
                    console.error("Error creating access code:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send({ 'accessCode': accessCode });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send();
        });
}

const getAccessCode = (req, res) => {
    session
        .run('MATCH (u:User {name: $name, password: $password}) RETURN u', { name: req.body.name, password: req.body.password})
        .then(result => {
            console.log('User authenticated ', result.records[0]._fields[0]);

            createAccessCode(req.body.name, (err, accessCode) => {
                if (err) {
                    console.error("Error creating access code:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send({ 'accessCode': accessCode });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).send();
        });
}

const getUsers = (req, res) => { 
    session
        .run('MATCH (n:User) RETURN n;')
        .then(result => {
            console.log('Get users ', result.records);
            res.send(extractUserProperties(result.records));
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
}


module.exports = {
    postUser: postUser,
    getUsers: getUsers,
    getAccessCode: getAccessCode
};
