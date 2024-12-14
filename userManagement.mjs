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
      db.execute('DELETE FROM patients WHERE username = ?', [username]),
      db.execute('DELETE FROM history WHERE username = ?', [username]),
      db.execute('DELETE FROM symptoms WHERE username = ?', [username]),
      db.execute('DELETE FROM exacerbation WHERE username = ?', [username]),
      fs.promises.unlink(`../QRESP_frontend/src/qr/${username}.png`)
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

async function updateUser (username, password) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'UPDATE users SET password = ? WHERE username = ?',
      [password, username]
    );
    console.log('User updated:', result);
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
    console.log('User:', result);
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
      'INSERT INTO patients (username, dni, name, last_name, birth, tel, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
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

async function updatePatient (username, dni, name, lastName, birth, tel, gender, age) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'UPDATE patients SET dni = ?, name = ?, last_name = ?, birth = ?, tel = ?, gender = ?, age = ? WHERE username = ?',
      [dni, name, lastName, birth, tel, gender, age, username]
    );
    console.log('Patient updated:', result);
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
    console.log('Patient:', result);
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
