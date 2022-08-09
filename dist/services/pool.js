"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    password: "ILTPvGaWA@1",
    host: "localhost",
    port: 5432,
    database: "imagetotext",
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    allowExitOnIdle: true,
    /*statement_timeout: 30000,
        query_timeout: 30000,
        connectionTimeoutMillis: 30000,*/
});
exports.pool = pool;
pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});
