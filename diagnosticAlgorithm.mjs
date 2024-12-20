import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import connectDB from './dbConnection.mjs';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function fileToGenerativePart (path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType
    }
  };
}

const filePart1 = fileToGenerativePart('data/AGUDITZACIONS.pdf', 'application/pdf');
const filePart2 = fileToGenerativePart('data/Enfermedades_Intersticiales_pulmonares.pdf', 'application/pdf');
const filePart3 = fileToGenerativePart('data/Bronquiolitis.html', 'text/html');
const filePart4 = fileToGenerativePart('data/Fibrosis.html', 'text/html');
const filePart5 = fileToGenerativePart('data/Neumonia_linfoide.html', 'text/html');

async function run (prompt) {
  const imageParts = [
    filePart1,
    filePart2,
    filePart3,
    filePart4,
    filePart5
  ];

  const generatedContent = await model.generateContent([prompt, ...imageParts]);

  return generatedContent.response.text();
}

let prompt, age, gender, mpid, ttmBase, immuno, comorbi, symptomsStr;
const symList = [];
let analitic, gasometry, ecg, torax;
let micro, antigenuria, hemo, pcr;
let currDate;

async function generateDiagnostic (username) {
  const db = connectDB();
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
    if (symp) {
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
    } else symptomsStr = 'no presenta símptomes';
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  } finally {
    db.end();
  }
  prompt = `Imagina que ets un doctor especialitzat en pneumologia.
    Necessito que no t'esplaixis i em donis una resposta clara i concisa, ja que podria ser que el pacient necessités anar a urgències.
    Amb una explicació per sobre dels seus síntomes i com això afecta la seva condició hi haurà prou. Fes ús dels arxius adjunts per a la teva resposta.
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
    Pren la decisió amb criteris clínics rigorosos i amb la informació que t'he proporcionat.
    En cas que hagi d'anar a urgències, la primera frase que diràs serà "AQUEST PACIENT HA D'ANAR A URGÈNCIES",
    en cas contrari, la primera frase serà "AQUEST PACIENT NO HA D'ANAR A URGÈNCIES".
    Vull la resposta en text sense format i que cada vegada que parli amb tu oblidis el que s'ha parlat anteriorment.
    Fes ús dels arxius adjunts per a la teva resposta.`;

  const result = await run(prompt);

  return result;
}

async function generateDecision (username, valoration) {
  const db = connectDB();
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
    analitic = await db.execute(
      'SELECT analitic FROM tests WHERE username = ?', [username]
    );
    analitic = analitic[0][0].analitic;
    gasometry = await db.execute(
      'SELECT gasometry FROM tests WHERE username = ?', [username]
    );
    gasometry = gasometry[0][0].gasometry;
    ecg = await db.execute(
      'SELECT ecg FROM tests WHERE username = ?', [username]
    );
    ecg = ecg[0][0].ecg;
    torax = await db.execute(
      'SELECT torax FROM tests WHERE username = ?', [username]
    );
    torax = torax[0][0].torax;
    micro = await db.execute(
      'SELECT micro FROM tests2 WHERE username = ?', [username]
    );
    micro = micro && micro.length > 0 ? micro[0].micro : false;
    antigenuria = await db.execute(
      'SELECT antigenuria FROM tests2 WHERE username = ?', [username]
    );
    antigenuria = antigenuria && antigenuria.length > 0 ? antigenuria[0].antigenuria : false;
    hemo = await db.execute(
      'SELECT hemo FROM tests2 WHERE username = ?', [username]
    );
    hemo = hemo && hemo.length > 0 ? hemo[0].hemo : false;
    pcr = await db.execute(
      'SELECT pcr FROM tests2 WHERE username = ?', [username]
    );
    pcr = pcr && pcr.length > 0 ? pcr[0].pcr : false;
    currDate = await db.execute(
      'SELECT curr_date FROM tests WHERE username = ?', [username]
    );
    currDate = currDate[0][0].curr_date;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
  switch (valoration) {
    case 'pneumonia': {
      if (immuno === 'Immunosuprimit') {
        prompt = `Imagina que ets un doctor especialitzat en pneumologia.
        És molt important que t'expressis amb claredat i sense allargar de més la resposta.
        Necessito que ofereixis un diagnòstic amb el seu respectiu tractament per a un pacient que pateix d'una MPID i té les següents condicions:
        - Edat: ${age}
        - Gènere: ${gender}
        - Tipus de MPID: ${mpid}
        - Tractament base: ${ttmBase} 
        - Immunosupressió: ${immuno} 
        - Comorbiditats: ${comorbi} 
        - Síntomes: ${symptomsStr}
        - Resultat de l'analítica urgent: ${analitic}
        - Gasometria arterial: ${gasometry}
        - ECG: ${ecg}
        - Radiografia de tòrax: ${torax}
        - MICRO: Esput: ${micro}
        - Antigenúria: ${antigenuria}
        - 2 Hemocultius: ${hemo}
        - PCR virus Influenza A i B: ${pcr}
        - Data de les proves: ${currDate}

        És molt important que tinguis en compte que és molt probable que el pacient tingui pneumònia,
        en cas de considerar que la prova del PCR és positiva per al virus Influenza,
        hauràs de prescriure Piperacilina/Tazobactam 4g/0,5g /8h e.v. (ó cefalosporina 3ª generació) + Levofloxacino 500mg/24h v.o.
        En cas de sospitar de CMV, hauràs de prescriure Ganciclovir 5mg/Kg pes/12h e.v.
        En cas de sospitar Pn. jiroveci, hauràs de prescriure Sulfametoxazol/trimetoprim 800/160 mg/12h e.v. + Àc. Fòlic.
        Vull la resposta en text sense format i que cada vegada que parli amb tu oblidis el que s'ha parlat anteriorment.
        Fes ús dels arxius adjunts per a la teva resposta.
        `;
      } else {
        prompt = `Imagina que ets un doctor especialitzat en pneumologia.
        És molt important que t'expressis amb claredat i sense allargar de més la resposta.
        Necessito que ofereixis un diagnòstic amb el seu respectiu tractament per a un pacient que pateix d'una MPID i té les següents condicions:
        - Edat: ${age}
        - Gènere: ${gender}
        - Tipus de MPID: ${mpid}
        - Tractament base: ${ttmBase} 
        - Immunosupressió: ${immuno} 
        - Comorbiditats: ${comorbi} 
        - Síntomes: ${symptomsStr}
        - Resultat de l'analítica urgent: ${analitic}
        - Gasometria arterial: ${gasometry}
        - ECG: ${ecg}
        - Radiografia de tòrax: ${torax}
        - MICRO: Esput: ${micro}
        - Antigenúria: ${antigenuria}
        - 2 Hemocultius: ${hemo}
        - PCR virus Influenza A i B: ${pcr}
        - Data de les proves: ${currDate}

        És molt important que tinguis en compte que probablement el pacient tingui pneumònia i que
        siguis rigurós amb els criteris clínics segons les condicions donades.
        Com el pacient és immunocompetent, hauràs de prescriure un tractament que inclogui:
        - Oseltamivir 75mg/12h v.o.
        - Cefalosporina 3ªG + Levofloxacino 500 mg/24h v.o.
        Vull la resposta en text sense format i que cada vegada que parli amb tu oblidis el que s'ha parlat anteriorment.
        Fes ús dels arxius adjunts per a la teva resposta.
        `;
      }
      break;
    }

    case 'no_pneumonia': {
      if (micro && antigenuria && hemo && pcr) {
        prompt = `Imagina que ets un doctor especialitzat en pneumologia.
        És molt important que t'expressis amb claredat i sense allargar de més la resposta.
        Necessito que ofereixis un diagnòstic amb el seu respectiu tractament per a un pacient que pateix d'una MPID i té les següents condicions:
        - Edat: ${age}
        - Gènere: ${gender}
        - Tipus de MPID: ${mpid}
        - Tractament base: ${ttmBase} 
        - Immunosupressió: ${immuno} 
        - Comorbiditats: ${comorbi} 
        - Síntomes: ${symptomsStr}
        - Resultat de l'analítica urgent: ${analitic}
        - Gasometria arterial: ${gasometry}
        - ECG: ${ecg}
        - Radiografia de tòrax: ${torax}
        - MICRO: Esput: ${micro}
        - Antigenúria: ${antigenuria}
        - 2 Hemocultius: ${hemo}
        - PCR virus Influenza A i B: ${pcr}
        - Data de les proves: ${currDate}

        És molt important que tinguis en compte que siguis rigurós amb els criteris clínics segons les condicions donades.
        Com probablement el pacient no tingui pneumònia, hauràs de prescriure un tractament que inclogui:
        - OXIGENOTERAPIA ajustant FIO2 segons requeriments (SatO2 > 92%).
        - INHIBIDOR BOMBA PROTONS (Omeprazol 20 mg/12-24h e.v.)
        - N-ACETILCISTEÏNA 600 mg/8h v.o. (potent antioxidant pulmonar).
        - Només si fumadors/exfumadors: nebulitzacions amb 1,5-2cc atrovent + 2cc SF +/- 0,5cc salbutamol (si no Hipertensió Pulmonar).
        - MORFINA 2,5-5mg s.c. puntual si dispnea intensa.
        - HBPM: Bemiparina 2500-3500 UI/0,2 mL (segons Kg pes) s.c./dia
        - METILPREDNISOLONA (en casos específics): 0.5-1 mg/Kg pes/d e.v + CALCI +Vit D 500mg/400 UI: 2comp/d v.o
        - LOSARTAN 50mg/24h v.o. (antiapoptòtic epitelial). Tan sols si sospita dany epitelial alveolar i no hipoTA).

        A més a més, has de proporcionar un tractament específic per al pacient segons les seves condicions.
        Vull la resposta en text sense format i que cada vegada que parli amb tu oblidis el que s'ha parlat anteriorment.
        Fes ús dels arxius adjunts per a la teva resposta.
        `;
      } else {
        prompt = `Imagina que ets un doctor especialitzat en pneumologia.
        És molt important que t'expressis amb claredat i sense allargar de més la resposta.
        Necessito que ofereixis un diagnòstic amb el seu respectiu tractament per a un pacient que pateix d'una MPID i té les següents condicions:
        - Edat: ${age}
        - Gènere: ${gender}
        - Tipus de MPID: ${mpid}
        - Tractament base: ${ttmBase} 
        - Immunosupressió: ${immuno} 
        - Comorbiditats: ${comorbi} 
        - Síntomes: ${symptomsStr}
        - Resultat de l'analítica urgent: ${analitic}
        - Gasometria arterial: ${gasometry}
        - ECG: ${ecg}
        - Radiografia de tòrax: ${torax}
        - Data de les proves: ${currDate}

        És molt important que tinguis en compte que siguis rigurós amb els criteris clínics segons les condicions donades.
        Com probablement el pacient no tingui pneumònia, hauràs de prescriure un tractament que inclogui:
        - OXIGENOTERAPIA ajustant FIO2 segons requeriments (SatO2 > 92%).
        - INHIBIDOR BOMBA PROTONS (Omeprazol 20 mg/12-24h e.v.)
        - N-ACETILCISTEÏNA 600 mg/8h v.o. (potent antioxidant pulmonar).
        - Només si fumadors/exfumadors: nebulitzacions amb 1,5-2cc atrovent + 2cc SF +/- 0,5cc salbutamol (si no Hipertensió Pulmonar).
        - MORFINA 2,5-5mg s.c. puntual si dispnea intensa.
        - HBPM: Bemiparina 2500-3500 UI/0,2 mL (segons Kg pes) s.c./dia
        - METILPREDNISOLONA (en casos específics): ½-1 mg/Kg pes/d e.v + CALCI +Vit D 500mg/400 UI: 2comp/d v.o
        - LOSARTAN 50mg/24h v.o. (antiapoptòtic epitelial). Tan sols si sospita dany epitelial alveolar i no hipoTA).

        A més a més, has de proporcionar un tractament específic per al pacient segons les seves condicions.
        Vull la resposta en text sense format i que cada vegada que parli amb tu oblidis el que s'ha parlat anteriorment.
        Fes ús dels arxius adjunts per a la teva resposta.
        `;
      }
      break;
    }

    default: {
      prompt = `Imagina que ets un doctor especialitzat en pneumologia.
        És molt important que t'expressis amb claredat i sense allargar de més la resposta.
        Necessito que ofereixis un diagnòstic amb el seu respectiu tractament per a un pacient que pateix d'una MPID i té les següents condicions:
        - Edat: ${age}
        - Gènere: ${gender}
        - Tipus de MPID: ${mpid}
        - Tractament base: ${ttmBase} 
        - Immunosupressió: ${immuno} 
        - Comorbiditats: ${comorbi} 
        - Síntomes: ${symptomsStr}
        - Resultat de l'analítica urgent: ${analitic}
        - Gasometria arterial: ${gasometry}
        - ECG: ${ecg}
        - Radiografia de tòrax: ${torax}
        - MICRO: Esput: ${micro}
        - Antigenúria: ${antigenuria}
        - 2 Hemocultius: ${hemo}
        - PCR virus Influenza A i B: ${pcr}
        - Data de les proves: ${currDate}

        En aquest cas, no disposem d'un diagnòstic concret per al pacient, però és molt important que
        tinguis en compte que siguis rigurós amb els criteris clínics segons les condicions donades.
        En cas que sospitis que ens trobem davant d'un cas de TEP, hauràs de demanar una ANGIO-TACAR + D-Dímer.
        Si efectivament es tracta d'un TEP, hauràs de prescriure:
        S'ingressarà al pacient a NML i li hauràs de prescriure:
        + HBPM (Tinzaparina 20000UI 0,5-0,9 mL (segons Kg pes)) s.c./dia

        Si no es tractava de TEP, fes-li una valoració parènquima i tracta el seu cas individualment.
        A partir de la informació proporcionada, hauràs de prescriure un tractament específic per al pacient.
        Vull la resposta en text sense format i que cada vegada que parli amb tu oblidis el que s'ha parlat anteriorment.
        Fes ús dels arxius adjunts per a la teva resposta.
        `;
      break;
    }
  }
  const result = await run(prompt);
  return result;
}

export { generateDiagnostic, generateDecision };
