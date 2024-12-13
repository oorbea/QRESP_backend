import mysql from 'mysql/promises';

async function connectDB () {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: 'qresp_bd'
    });
    console.log('Database connected');
    return connection;
  } catch (err) {
    console.error('Database connection failed: ' + err);
    throw err;
  }
}

export default connectDB;
