import { symptomsSchema } from './schemas/symptoms.mjs';
import { historySchema } from './schemas/history.mjs';
import connect from './dbConnection.mjs';

function validateSymptoms (symptoms) {
  return symptomsSchema.safeParse(symptoms);
}

function validateHistory (history) {
  return historySchema.safeParse(history);
}

async function createSymptoms (username, suffocate, cough, mucus, congestion, throat, fever, chestPain, whistle, malaise) {
  const db = connect();
  try {
    db.execute('DELETE FROM symptoms WHERE username = ?', [username]);
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO symptoms (username, suffocate, cough, mucus, congestion, throat, fever, chest_pain, whistle, malaise) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, suffocate, cough, mucus, congestion, throat, fever, chestPain, whistle, malaise]
    );
    console.log('Symptoms created:', result);
    db.end();
    return result;
  } catch (error) {
    console.error('Error inserting data:', error);
    db.end();
    throw error;
  }
}

async function getSymptoms (username) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'SELECT * FROM symptoms WHERE username = ?', [username]
    );
    console.log('Symptoms:', result);
    return result;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function createHistory (username, mpid, ttmBase, immuno, comorbi) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'INSERT INTO history (username, mpid, ttm_base, immuno, comorbi) VALUES (?, ?, ?, ?, ?)',
      [username, mpid, ttmBase, immuno, comorbi]
    );
    console.log('History created:', result);
    return result;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

async function getHistory (username) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'SELECT * FROM history WHERE username = ?', [username]
    );
    console.log('History:', result);
    return result;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  } finally {
    db.end();
  }
}

export { validateSymptoms, validateHistory, createSymptoms, getSymptoms, createHistory, getHistory };
