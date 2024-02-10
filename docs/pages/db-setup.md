# DB Setup

For this project, a minimal MySQL DB(as recommended) with just a `users` table was used.
A local install of `Sequelize` and `Sequelize CLI` were used to manage the DB and tables.

## Steps

1. Look into `apps/api/src/v1/config/db.js` for the right env variables for the DB connection
2. Run `pnpm db:create` to create the db
3. Run `pnpm db:migrate` for migrations to create the needed tables

> No need to run seeders for data

## Resources

- [Sequelize CLI](https://sequelize.org/docs/v7/cli/)
