import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

export default [
  {
    name: process.env.DB_NAME || 'default',
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    synchronize: false,
    logging: ['error'],
    maxQueryExecutionTime: 1000,
    username: process.env.DB_USERNAME || 'ilmsmodule',
    password: process.env.DB_PASSWORD || 'ilmsmodule',
    database: process.env.DB_DATABASE_NAME || 'ilmsmodule',
    entities: ['./src/entities/*.{ts,js}'],
    migrations: ['./src/migrations/**/*.ts', './src/migrations/**/*.js'],
    subscribers: ['./src/subscribers/**/*.ts', './src/subscribers/**/*.js'],
    cli: {
      entitiesDir: './entities',
      migrationsDir: './migrations',
      subscribersDir: './subscribers',
    },
  },
];
