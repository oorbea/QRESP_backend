import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectDB from './dbConnection.mjs';
import { createUser, deleteUser, updateUser, getUser, userExists, createPatient, updatePatient, getPatient, validateUser, validatePatient } from './userManagement.mjs';
import { validateSymptoms, createSymptoms, getSymptoms, getHistory, validateHistory, createHistory } from './medicalManagement.mjs';
import { generateAndSaveQR } from './loginQR.mjs';

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 1000;
const BASE_URL = `http://localhost:${PORT}`;

app.post('/qresp_api/login', async (req, res) => {
  const result = validateUser(req.body);
  if (result.error) return res.status(400).json({ message: result.error.errors[0].message });

  const [username, password] = [req.body.username, req.body.password];

  const db = connectDB();

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = rows[0];

    res.status(200).json({ message: 'Login successful', username: user.username });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  } finally {
    db.end();
  }
});

app.get('/qresp_api/login', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      message: 'Login successful',
      username: decoded.username
    });
  } catch (err) {
    console.error('Invalid token:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/qresp_api/qr/:username', async (req, res) => {
  try {
    const db = connectDB();
    const result = await db.execute('SELECT qr from users WHERE username = ?', [req.params.username]);
    res.status(200).json({ qrCode: result });
  } catch (err) {
    console.error('Error generating QR code:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error generating QR code: ${err.message}` });
  }
});

app.post('/qresp_api/qr', async (req, res) => {
  try {
    const result = await generateAndSaveQR(req.body.username, req.body.password);
    const db = connectDB();
    db.execute('UPDATE users SET qr = ?', [result]);
    res.status(201).json({ qrCode: result });
  } catch (err) {
    console.error('Error generating QR code:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error generating QR code: ${err.message}` });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API connected' });
});

app.get('/qresp_api/user/:username', async (req, res) => {
  try {
    const user = await getUser(req.params.username);
    res.status(200).json(user);
  } catch (err) {
    console.error('Error getting user:', err);
    console.error('Data provided:', req.params);
    res.status(500).json({ message: `Error getting user: ${err.message}` });
  }
});

app.post('/qresp_api/user', async (req, res) => {
  try {
    const result = validateUser(req.body);
    if (result.error) return res.status(400).json({ message: result.error.errors[0].message });

    const user = await userExists(req.body.username);
    if (user.length > 0) return res.status(409).json({ message: 'User already exists' });

    const [username, password, rePassword] = [req.body.username, req.body.password, req.body.re_password];
    if (password !== rePassword) return res.status(400).json({ message: 'Passwords do not match' });

    await createUser(username, password);
    res.status(201).json({ username, password });
  } catch (err) {
    console.error('Error registering user:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error registering user: ${err.message}` });
  }
});

app.put('/qresp_api/user/:username', async (req, res) => {
  try {
    const result = validateUser(req.body);
    if (result.error) return res.status(400).json({ message: result.error.errors[0].message });
    const user = await userExists(req.params.username);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    await updateUser(req.params.username, req.body.password);
    res.status(200).json({ username: req.params.username, password: req.body.password });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: `Error updating user: ${err.message}` });
  }
});

app.delete('/qresp_api/user/:username', async (req, res) => {
  try {
    await deleteUser(req.params.username);
    res.status(204).json({ message: `User ${req.params.username} deleted` });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: `Error deleting user: ${err.message}` });
  }
});

app.get('/qresp_api/patient/:username', async (req, res) => {
  try {
    const patient = await getPatient(req.params.username);
    res.status(200).json(patient);
  } catch (err) {
    console.error('Error getting patient:', err);
    console.error('Data provided:', req.params);
    res.status(500).json({ message: `Error getting patient: ${err.message}` });
  }
});

app.post('/qresp_api/patient', async (req, res) => {
  try {
    switch (req.body.gender) {
      case 'Home':
        req.body.gender = 'M';
        break;
      case 'Dona':
        req.body.gender = 'F';
        break;
      case 'Altres':
        req.body.gender = 'O';
        break;

      default:
        req.body.gender = 'O';
        break;
    }
    const result = validatePatient(req.body);
    if (result.error) return res.status(400).json({ message: result.error.errors[0].message });
    const user = await userExists(req.body.username);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const age = parseInt((new Date().getFullYear()) - (new Date(req.body.birth).getFullYear()));
    const [username, dni, name, lastName, birth, tel, gender] = [req.body.username, req.body.dni, req.body.name, req.body.last_name, req.body.birth, req.body.tel, req.body.gender];
    await createPatient(username, dni, name, lastName, birth, tel, gender, age);
    res.status(201).json({ username, dni, name, lastName, birth, tel, gender, age });
  } catch (err) {
    console.error('Error creating patient:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error creating patient: ${err.message}` });
  }
});

app.put('/qresp_api/patient/:username', async (req, res) => {
  try {
    const result = validatePatient(req.body);
    if (result.error) return res.status(400).json({ message: result.error.errors[0].message });
    const user = await userExists(req.params.username);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const age = new Date().getFullYear() - new Date(req.body.birth).getFullYear();
    const [username, dni, name, lastName, birth, tel, gender] = [result.username, result.dni, result.name, result.last_name, result.birth, result.tel, result.gender];
    await updatePatient(username, dni, name, lastName, birth, tel, gender, age);
    res.status(200).json({ username, dni, name, lastName, birth, tel, gender, age });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ message: `Error updating patient: ${err.message}` });
  }
});

app.get('/qresp_api/symptoms/:username', async (req, res) => {
  try {
    const symptoms = await getSymptoms(req.params.username);
    res.status(200).json(symptoms);
  } catch (err) {
    console.error('Error getting symptoms:', err);
    console.error('Data provided:', req.params);
    res.status(500).json({ message: `Error getting symptoms: ${err.message}` });
  }
});

app.post('/qresp_api/symptoms', async (req, res) => {
  try {
    const result = validateSymptoms(req.body);
    if (result.error) return res.status(400).json({ message: result.error.errors[0].message });
    const user = await userExists(req.body.username);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const [username, suffocate, cough, mucus, congestion, throat, fever, chestPain, whistle, malaise] = [req.body.username, req.body.suffocate, req.body.cough, req.body.mucus, req.body.congestion, req.body.throat, req.body.fever, req.body.chest_pain, req.body.whistle, req.body.malaise];
    await createSymptoms(username, suffocate, cough, mucus, congestion, throat, fever, chestPain, whistle, malaise);
    res.status(201).json({ username, suffocate, cough, mucus, congestion, throat, fever, chestPain, whistle, malaise });
  } catch (err) {
    console.error('Error creating symptoms:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error creating symptoms: ${err.message}` });
  }
});

app.get('/qresp_api/history/:username', async (req, res) => {
  try {
    const history = await getHistory(req.params.username);
    res.status(200).json(history);
  } catch (err) {
    console.error('Error getting history:', err);
    console.error('Data provided:', req.params);
    res.status(500).json({ message: `Error getting medical history: ${err.message}` });
  }
});

app.post('/qresp_api/history', async (req, res) => {
  try {
    const result = validateHistory(req.body);
    if (result.error) return res.status(400).json({ message: result.error.errors[0].message });
    const user = await userExists(req.body.username);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const [username, mpid, ttmBase, immuno, comorbi] = [req.body.username, req.body.mpid, req.body.ttm_base, req.body.immuno, req.body.comorbi];
    await createHistory(username, mpid, ttmBase, immuno, comorbi);
    res.status(201).json({ username, mpid, ttmBase, immuno, comorbi });
  } catch (err) {
    console.error('Error creating history:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error creating medical history: ${err.message}` });
  }
});

app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada</h1>');
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + BASE_URL);
});
