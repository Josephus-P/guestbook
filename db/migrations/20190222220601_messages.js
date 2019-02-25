exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', tbl => {
    tbl.increments();
    tbl
      .string('user_uid')
      .references('uid')
      .inTable('users');
    tbl.string('message');
    tbl.string('created_date');
    tbl.integer('total_karma').defaultTo(0);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
