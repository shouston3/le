const bcrypt = require('bcrypt');

module.exports = (pool, creds) => {
  return new Promise((resolve, reject) => {
    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject('connection err');
      }

      client.query(
        'select username from user_table',
        (selectErr, data) => {
          if (selectErr) {
            done();
            return reject(selectErr);
          }

          if (data.rows.map((u) => u.username).indexOf(creds.username) > -1) {
            done();
            return reject('username not available');
          }

          bcrypt.hash(creds.password, 10, (hashErr, hash) => {
            if (hashErr) {
              return reject(hashErr);
            }

            client.query(
              'insert into user_table (username, password) values ($1, $2)',
              [creds.username, hash],
              (insertErr) => {
                done();
                if (insertErr) {
                  return reject(insertErr);
                }

                resolve();
              }
            );
          });
        }
      );
    });
  });
};
