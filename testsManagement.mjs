import { testsSchema } from './schemas/tests.mjs';
import connect from './dbConnection.mjs';

function validateTests (tests) {
  return testsSchema.safeParse(tests);
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

export { validateTests, createTests, deleteTests };
