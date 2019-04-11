const db = require('../dbConfig');

module.exports = {
  getAllComments: () => {
    return db('messages as m')
      .join('users as u', 'm.user_uid', 'u.uid')
      .select(
        'm.id',
        'm.created_date',
        'm.message',
        'u.display_name',
        'u.photo_url',
        'm.total_karma'
      )
      .orderBy('m.id', 'desc')
      .limit(6);
  },
  insertNewComment: comment => {
    return db('messages').insert(comment, ['id']);
  },
  incrementCommentKarma: id => {
    return db('messages')
      .where('id', id)
      .increment('total_karma', 1);
  },
};
