module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    useNullAsDefault: true,
  },
};
