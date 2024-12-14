import { symptomsSchema } from './schemas/symptoms.mjs';
import connect from './dbConnection.mjs';

function validateSymptoms (symptoms) {
  return symptomsSchema.safeParse(symptoms);
}

async function createSymptoms (username, suffocate, cough, mucus, congestion, throat, fever, chestPain, whistle, malaise) {
  const db = connect();
  try {
    const [result] = await db.execute(
      'INSERT INTO symptoms (username, suffocate, cough, mucus, congestion, throat, fever, chest_pain, whistle, malaise) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, suffocate, cough, mucus, congestion, throat, fever, chestPain, whistle, malaise]
    );
    console.log('Symptoms created:', result);
    return result;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  } finally {
    db.end();
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

export { validateSymptoms, createSymptoms, getSymptoms };
