exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', tbl => {
    tbl.increments();
    tbl
      .string('user_uid')
      .references('uid')
      .inTable('users');
    tbl.string('message');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
