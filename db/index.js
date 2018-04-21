const MongoClient = require('mongodb').MongoClient;
const assert = require('assert')

const host = 'localhost:27017';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

const getDatabase = (name) => {
    const url = 'mongodb://' + host + '/' + name;
    return f => MongoClient.connect(url, f)
}

const query = (dbExecute, f) => {
    return new Promise((resolve, reject) => {
        dbExecute((err, db) => {
            if (err !== null) {
                return reject(err);
            }
            console.log('connected to db');
            f(db, (resp) => {
                db.close();
                resolve(resp);
            })
        })
    });
}

const queryFactory = (dbExecute, f) => {
    return (...args) => query(dbExecute, f(...args))
}

module.exports = {
    assert: assert,
    host: host,
    client: MongoClient,
    getDatabase: getDatabase,
    query: query,
    queryFactory: queryFactory,
}