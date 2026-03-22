import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { join } from "path";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile, override: true });

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "agropangolin",
  entities: [join(__dirname, "../../../**/*.entity{.ts,.js}")],
  migrations: [join(__dirname, "migrations/*{.ts,.js}")],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
