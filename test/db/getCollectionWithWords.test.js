const tape = require('tape');
const assert = require('assert');
const redisCli = require('../test_helpers/configureRedis.js');
const pg = require('../test_helpers/configurePool.js');
const pool = new pg.pool(pg.config);

const flushDb = require('../helpers/flushDb.js')(pool, redisCli);
const registerUser = require('../helpers/registerUser.js')(pool, redisCli);
const createCollection = require('../../db/pg/createCollection.js')(pool);
const updateCollection = require('../../db/pg/updateCollection.js')(pool);
const getCollections = require('../../db/pg/getCollections.js')(pool);
const getWords = require('../../db/pg/getWords.js')(pool);
const getCollectionWithWords = require('../../db/pg/getCollectionWithWords.js')(pool);

tape('getCollectionWithWords', (t) => {
  flushDb()
    .then(() => registerUser({ username: 'sam', password: 'pass' }))
    .then(() => {
      const collectionObj = {
        username: 'sam',
        collection_name: 'col1',
        collection_description: 'col desc1'
      };

      return createCollection(collectionObj);
    })
    .then(() => {
      const collectionObj = {
        username: 'sam',
        collection_name: 'col2',
        collection_description: 'col desc2'
      };

      return createCollection(collectionObj);
    })
    .then(() => {
      const collectionObj = {
        collection_id: '100',
        new_words: [
          {
            direction: 'deToEn',
            source_word: 'Wiedersehen',
            target_words: ['Bye'],
            attempts: 10,
            correct_attempts: 6,
            score: 5
          },
          {
            direction: 'enToDe',
            source_word: 'hello',
            target_words: ['hallo', 'Guten Tag'],
            attempts: 10,
            correct_attempts: 8,
            score: 6
          },
          {
            direction: 'deToEn',
            source_word: 'das Auto',
            target_words: ['the car'],
            attempts: 12,
            correct_attempts: 8,
            score: 9
          }
        ]
      };
      return updateCollection(collectionObj);
    })
    .then(() => getCollectionWithWords('100'))
    .then((res) => {
      t.equal(res.collection_id, '100');
      t.equal(res.collection_name, 'col1');
      t.equal(res.collection_description, 'col desc1');
      t.equal(res.words.length, 3);
      t.equal(res.words[0].word_id, '100');
      t.equal(res.words[0].direction, 'deToEn');
      t.equal(res.words[0].source_word, 'Wiedersehen');
      t.deepEqual(res.words[0].target_words, [ 'Bye' ]);
      t.equal(res.words[0].hint, null);
      t.equal(res.words[0].attempts, '0');
      t.equal(res.words[0].correct_attempts, '0');
      t.equal(res.words[0].score, 5);

      t.equal(res.words[1].word_id, '101');
      t.equal(res.words[1].direction, 'enToDe');
      t.equal(res.words[1].source_word, 'hello');
      t.deepEqual(res.words[1].target_words, [ 'hallo', 'Guten Tag' ]);
      t.equal(res.words[1].hint, null);
      t.equal(res.words[1].attempts, '0');
      t.equal(res.words[1].correct_attempts, '0');
      t.equal(res.words[1].score, 5);

      t.equal(res.words[2].word_id, '102');
      t.equal(res.words[2].direction, 'deToEn');
      t.equal(res.words[2].source_word, 'das Auto');
      t.deepEqual(res.words[2].target_words, [ 'the car' ]);
      t.equal(res.words[2].hint, null);
      t.equal(res.words[2].attempts, '0');
      t.equal(res.words[2].correct_attempts, '0');
      t.equal(res.words[2].score, 5);

      t.end();
    })
    .catch((err) => assert(!err, err));
});

tape.onFinish(() => {
  flushDb()
    .then(() => {
      pool.end();
      redisCli.quit();
    });
});
