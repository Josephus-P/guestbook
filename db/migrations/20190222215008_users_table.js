exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.string('uid').unique();
    tbl.string('display_name').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
