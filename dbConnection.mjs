import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;

function connectDB () {
  try {
    const connection = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: DB_PASSWORD,
      database: 'qresp_bd',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    return connection;
  } catch (err) {
    console.error('Database connection failed: ' + err);
    throw err;
  }
}

export default connectDB;
