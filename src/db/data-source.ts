import { DataSourceOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_DB,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT!),
  entities: [__dirname + '/../modules/**/**/*.entity.js'],
  migrations: [__dirname + '/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
