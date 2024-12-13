import connect from './dbConnection.mjs';

async function createUser (username, password) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    console.log('User created:', result);
    return result;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

export default createUser;
