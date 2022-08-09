const { Pool } = require("pg");
//import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  password: "ILTPvGaWA@1",
  host: "localhost",
  port: 5432,
  database: "imagetotext",
  max: 10, //was 20
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  allowExitOnIdle: true,
  /*statement_timeout: 30000,
      query_timeout: 30000,
      connectionTimeoutMillis: 30000,*/
});

pool.on("error", (err: any, client: any) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export = pool;
