const neo4j = require('neo4j-driver');

const driver = neo4j.driver("neo4j+s://fc68e483.databases.neo4j.io:7687", neo4j.auth.basic("neo4j", "S63HXMMDQUuEMnLRiiygHz9exJ_A6_BANM7e3Ydolqo"));
const session = driver.session();

module.exports = session;