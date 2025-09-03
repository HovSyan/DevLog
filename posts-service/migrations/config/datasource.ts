import { DataSource } from 'typeorm';
import 'dotenv/config';

export default new DataSource({
    type: 'postgres',
    // TODO: make validation for environment variables
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: +process.env.POSTGRES_PORT!,
    host: process.env.POSTGRES_HOST,
    migrations: ['./migrations/*.ts'],
});
