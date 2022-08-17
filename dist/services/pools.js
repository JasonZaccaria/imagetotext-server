"use strict";
const { Pool } = require("pg");
//import { Pool } from "pg";
const pool = new Pool({
    user: process.env.User,
    password: process.env.Password,
    host: process.env.Host,
    port: process.env.Port,
    database: process.env.Database,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    allowExitOnIdle: true,
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    /*statement_timeout: 30000,
        query_timeout: 30000,
        connectionTimeoutMillis: 30000,*/
});
pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});
module.exports = pool;
