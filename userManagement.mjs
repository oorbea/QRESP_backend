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

async function deleteUser (username) {
  const db = connect();
  try {
    const results = await Promise.all([
      db.execute('DELETE FROM users WHERE username = ?', [username]),
      db.execute('DELETE FROM patients WHERE username = ?', [username])
    ]);
    console.log('User deleted:', results);
    return results;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function userExists (username) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'SELECT username FROM users WHERE username = ?', [username]
    );
    console.log('User exists:', result);
    return result;
  } catch (error) {
    console.error('Error checking data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function createPatient (username, dni, name, lastName, birth, tel, gender, age) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'INSERT INTO patients (username, dni, name, last_name, birth, tel, gender, age) VALUES (?, ?)',
      [username, dni, name, lastName, birth, tel, gender, age]
    );
    console.log('Patient created:', result);
    return result;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

export { createUser, deleteUser, userExists, createPatient };
