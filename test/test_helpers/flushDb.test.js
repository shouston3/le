const tape = require('tape');
const assert = require('assert');

const redisCli = require('./configureRedis.js');
const pg = require('./configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const setupPool = require('../helpers/setupPool.js')(pool);

function rejectErr (err, reject) {
  if (err) {
    reject(err);
  }
}

tape('flush db clears pg database', (t) => {
  flushDb()
    .then(setupPool)
    .then((_) => {
      return new Promise((resolve, reject) => {
        _.client.query(
          'select * from user_table',
          (err, data) => {
            rejectErr(err, reject);
            t.equal(data.rows.length, 0, 'pg database is empty', 'KYiiYb5Ofc');
            resolve({ client: _.client, done: _.done });
          }
        );
      });
    })
    .then((_) => {
      return new Promise((resolve, reject) => {
        _.client.query(
          'insert into user_table (username, password) values ($1,$2)',
          ['sam', 'pass'],
          (err) => {
            rejectErr(err, reject);
            resolve({ client: _.client, done: _.done });
          }
        );
      });
    })
    .then((_) => {
      return new Promise((resolve, reject) => {
        _.client.query(
          'select * from user_table',
          (err, data) => {
            _.done();
            t.equal(data.rows.length, 1, 'pg database contains data', 'KYiiYb5Ofc');
            rejectErr(err, reject);
            resolve();
          }
        )
      });
    })
    .then(flushDb)
    .then(() => {
      return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
          rejectErr(err, reject);
          resolve({ client, done });
        });
      });
    })
    .then((_) => {
      return new Promise((resolve, reject) => {
        _.client.query(
          'select * from user_table',
          (err, data) => {
            _.done();
            rejectErr(err, reject)
            t.equal(data.rows.length, 0, 'pg database is cleared by flushDb', 'KYiiYb5Ofc');
            t.end();
          }
        );
      });
    })
    .catch((err) => assert(!err, err));
});

tape('flushDb clears the redis database', (t) => {
  flushDb()
    .then(() => redisCli.keysAsync('*'))
    .then((keys) => {
      t.equal(keys.length, 0, 'redis db is empty', 'KYiiYb5Ofc');
      return redisCli.set('key', 'value')
    })
    .then(() => redisCli.keysAsync('*'))
    .then((keys) => {
      t.equal(keys.length, 1, 'redis db has data', 'KYiiYb5Ofc');
      return flushDb();
    })
    .then(() => redisCli.keysAsync('*'))
    .then((keys) => {
      t.equal(keys.length, 0, 'redis db is cleared by flushDb', 'KYiiYb5Ofc');
      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  pool.end();
  redisCli.quit();
});
