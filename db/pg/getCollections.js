function format (rows) {
  const obj = {};
  rows.forEach((row) => {
    obj[row.collection_id] = {
      collection_name: row.collection_name,
      collection_description: row.collection_description
    };
  });
  return obj;
}

module.exports = (pool) => (username) => {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject('Username is not defined');
    }

    pool.connect((connectErr, client, done) => {
      if (connectErr) {
        done();
        return reject(collErr);
      }

      client.query(
        'select '
        + 'collection_table.collection_id, '
        + 'collection_table.collection_name, '
        + 'collection_table.collection_description '
        + 'from user_table inner join collection_table '
        + 'on user_table.user_id = collection_table.user_id '
        + 'where user_table.username = $1',
        [ username ],
        (selectErr, data) => {
          done();
          if (selectErr) {
            return reject(selectErr);
          }

          resolve(format(data.rows));
        }
      );
    });
  });
};

