import { testsSchema, tests2Schema } from './schemas/tests.mjs';

import connect from './dbConnection.mjs';

function validateTests (tests) {
  return testsSchema.safeParse(tests);
}

function validateTests2 (tests) {
  return tests2Schema.safeParse(tests);
}

async function getTests (username) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'SELECT * FROM tests WHERE username = ?', [username]
    );
    console.log('Tests:', result);
    return result;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function getTests2 (username) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'SELECT * FROM tests2 WHERE username = ?', [username]
    );
    console.log('Tests:', result);
    return result;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function createTests (username, analitic, gasometry, ecg, torax, currDate) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'INSERT INTO tests (username, analitic, gasometry, ecg, torax, curr_date) VALUES (?, ?, ?, ?, ?, ?)',
      [username, analitic, gasometry, ecg, torax, currDate]
    );
    console.log('Tests created:', result);
    return result;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function createTests2 (username, micro, antigenuria, hemo, pcr, currDate) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'INSERT INTO tests2 (username, micro, antigenuria, hemo, pcr, curr_date) VALUES (?, ?, ?, ?, ?, ?)',
      [username, micro, antigenuria, hemo, pcr, currDate]
    );
    console.log('Tests created:', result);
    return result;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function deleteTests (username, currDate) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'DELETE FROM tests WHERE username = ? AND curr_date = ?',
      [username, currDate]
    );
    console.log('Tests deleted:', result);
    return result;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function deleteTests2 (username, currDate) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'DELETE FROM tests2 WHERE username = ? AND curr_date = ?',
      [username, currDate]
    );
    console.log('Tests deleted:', result);
    return result;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

export { validateTests, getTests, createTests, deleteTests, validateTests2, getTests2, createTests2, deleteTests2 };
