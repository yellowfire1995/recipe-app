import Pool from "pg-pool";
import "dotenv/config";

const _ = process.env;

const db = new Pool({
  user: _.DB_USER,
  host: _.DB_HOST,
  database: _.DB_DB,
  password: _.DB_PW,
  port: _.DB_PORT,
  max: 32,
  idleTimeoutMillis: 36000000,
  connectionTimeoutMillis: 10000,
});

export default db;
