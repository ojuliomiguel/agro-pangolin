import * as dotenv from "dotenv";
console.log("BEFORE:", process.env.DB_PORT, process.env.DB_NAME);
dotenv.config();
console.log("AFTER:", process.env.DB_PORT, process.env.DB_NAME);
