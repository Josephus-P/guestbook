const db = require('../dbConfig');

module.exports = {
  getUserByUID: uid => {
    return db('users').where('uid', uid);
  },
  insertNewUser: user => {
    return db('users').insert(user);
  },
  updateUser: (uid, data) => {
    return db('users')
      .where('uid', uid)
      .update(data);
  },
};
