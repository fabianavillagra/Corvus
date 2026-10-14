import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

});

const testConnection = async () => {
    try {
        await pool.query ('SELECT NOW()');
        console.log('PostgreSQL connected successfully');
    }
    catch (error){
        console.error('Error connecting to PostgreSql', error);
    }
}

testConnection();

export default pool;

