import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'dental_clinic',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (!dbConfig.user) {
  throw new Error('DB_USER is required. Please set DB_USER in backend/.env before starting the API.');
}

const pool = mysql.createPool(dbConfig);

export async function verifyDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
  } catch (error) {
    const isAuthError = error?.code === 'ER_ACCESS_DENIED_ERROR';

    const guidance = isAuthError
      ? `MySQL authentication failed for user '${dbConfig.user}'. Update DB_USER/DB_PASSWORD in backend/.env or create a dedicated MySQL user.`
      : 'Unable to reach MySQL. Check DB_HOST/DB_PORT and ensure MySQL is running.';

    throw new Error(`${guidance} Original error: ${error.message}`);
  }
}

export default pool;
