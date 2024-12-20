import fs from 'fs';
import connect from './dbConnection.mjs';
import { userSchema } from './schemas/user.mjs';
import { patientSchema } from './schemas/patient.mjs';

async function createUser (username, password) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
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
      db.execute('DELETE FROM patients WHERE username = ?', [username]),
      db.execute('DELETE FROM history WHERE username = ?', [username]),
      db.execute('DELETE FROM symptoms WHERE username = ?', [username]),
      db.execute('DELETE FROM exacerbation WHERE username = ?', [username]),
      db.execute('DELETE FROM tests WHERE username = ?', [username]),
      fs.promises.access(`../QRESP_frontend/src/qr/${username}.png`, fs.constants.F_OK)
        .then(() => fs.promises.unlink(`../QRESP_frontend/src/qr/${username}.png`))
        .catch(() => console.log('File does not exist, skipping deletion'))
    ]);
    return results;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function updateUser (username, password) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'UPDATE users SET password = ? WHERE username = ?',
      [password, username]
    );
    return result;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function getUser (username) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'SELECT * FROM users WHERE username = ?', [username]
    );
    return result;
  } catch (error) {
    console.error('Error getting data:', error);
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
      'INSERT INTO patients (username, dni, name, last_name, birth, tel, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [username, dni, name, lastName, birth, tel, gender, age]
    );
    await db.execute(
      'INSERT INTO symptoms (username) VALUES (?)', [username]
    );
    return result;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function updatePatient (username, dni, name, lastName, birth, tel, gender, age) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'UPDATE patients SET dni = ?, name = ?, last_name = ?, birth = ?, tel = ?, gender = ?, age = ? WHERE username = ?',
      [dni, name, lastName, birth, tel, gender, age, username]
    );
    return result;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function getPatient (username) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'SELECT * FROM patients WHERE username = ?', [username]
    );
    return result;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

function validateUser (user) {
  return userSchema.safeParse(user);
}

function validatePatient (patient) {
  return patientSchema.safeParse(patient);
}

export { createUser, deleteUser, updateUser, getUser, userExists, createPatient, updatePatient, getPatient, validateUser, validatePatient };
