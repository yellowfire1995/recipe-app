import Pool from "pg-pool";
import "dotenv/config";

const _ = process.env;

const db = new Pool({
  user: _.DB_USER,
  host: _.DB_HOST,
  database: _.DB_DB,
  password: _.DB_PW,
  port: _.DB_PORT,
  max: 400,
  idleTimeoutMillis: 2000,
  connectionTimeoutMillis: 2000,
});

export default db;
