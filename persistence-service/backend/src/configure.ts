import { DataSource } from "typeorm";
import { Photo } from "./entities/photo";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Photo],
  synchronize: true,
  logging: false,
});

export { postgresDataSource as default }
