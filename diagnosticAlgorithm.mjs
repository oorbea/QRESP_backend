import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from './dbConnection.mjs';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let prompt;

async function generateDiagnostic (username) {
  const db = connectDB();
  let age; let gender; let mpid; let ttmBase; let immuno; let comorbi; const symList = []; let symptomsStr;
  try {
    age = await db.execute(
      'SELECT age FROM patients WHERE username = ?', [username]
    );
    age = age[0][0].age;
    gender = await db.execute(
      'SELECT gender FROM patients WHERE username = ?', [username]
    );
    gender = gender[0][0].gender;
    switch (gender) {
      case 'M':
        gender = 'masculí';
        break;
      case 'F':
        gender = 'femení';
        break;
      case 'O':
        gender = 'altres';
        break;
      default:
        break;
    }
    mpid = await db.execute(
      'SELECT mpid FROM history WHERE username = ?', [username]
    );
    mpid = mpid[0][0].mpid;
    ttmBase = await db.execute(
      'SELECT ttm_base FROM history WHERE username = ?', [username]
    );
    ttmBase = ttmBase[0][0].ttm_base;
    immuno = await db.execute(
      'SELECT immuno FROM history WHERE username = ?', [username]
    );
    immuno = immuno[0][0].immuno ? 'Immunosuprimit' : 'Immunocompetent';
    comorbi = await db.execute(
      'SELECT comorbi FROM history WHERE username = ?', [username]
    );
    comorbi = comorbi[0][0].comorbi;
    const symptoms = await db.execute(
      'SELECT * FROM symptoms WHERE username = ?', [username]
    );
    const symp = symptoms[0][0];
    if (symp.suffocate) symList.push('ofeg');
    if (symp.cough) symList.push('tos');
    if (symp.mucus) symList.push('increment de mucositat');
    if (symp.congestion) symList.push('congestió nasal');
    if (symp.throat) symList.push('dolor de gola');
    if (symp.fever) symList.push('febre');
    if (symp.chest_pain) symList.push('dolor toràcic');
    if (symp.whistle) symList.push('sibilància');
    if (symp.malaise) symList.push('malestar general');
    symptomsStr = symList.join(', ');
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  } finally {
    db.end();
  }
  prompt = `Imagina que ets un doctor especialitzat en pneumologia.
  Necessito que no t'esplaixis i em donis una resposta clara i concisa, ja que podria ser que el pacient necessités anar a urgències.
  Amb una explicació per sobre dels seus síntomes i com això afecta la seva condició hi haurà prou.
    Ara et proporcionaré dades d'un pacient que pateix d'una mpid i té les següents condicions:
    - Edat: ${age}
    - Gènere: ${gender}
    - Tipus de MPID: ${mpid}
    - Tractament base: ${ttmBase} 
    - Immunosupressió: ${immuno} 
    - Comorbiditats: ${comorbi} 
    Actualment presenta els següents síntomes: ${symptomsStr}. 
    Proporciona un diagnòstic per a aquest pacient. 
    És molt important que indiquis clarament si aquesta persona hauria d'anar a l'hospital d'urgències o pot esperar.
    Pren la decisió amb criteris clínics rigorosos i amb la informació que t'he proporcionat.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export { generateDiagnostic };
