exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.string('uid').unique();
    tbl.string('display_name').notNullable();
    tbl.string('photo_url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
