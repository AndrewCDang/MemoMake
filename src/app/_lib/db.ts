import postgres from "postgres";
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
export const db = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: "require",
});
