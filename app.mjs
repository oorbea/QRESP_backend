import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createUser, deleteUser, updateUser, getUser, userExists, createPatient, updatePatient, getPatient } from './userManagement.mjs';

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 1000;
const BASE_URL = `http://localhost:${PORT}`;

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API connected' });
});

app.get('/qresp_api/user', async (req, res) => {
  try {
    const user = await getUser(req.body.username);
    res.status(200).json(user);
  } catch (err) {
    console.error('Error getting user:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error getting user: ${err.message}` });
  }
});

app.post('/qresp_api/user', async (req, res) => {
  try {
    const user = await userExists(req.body.username);
    if (user.length > 0) return res.status(409).json({ message: 'User already exists' });
    if (req.body.password !== req.body.re_password) return res.status(400).json({ message: 'Passwords do not match' });

    await createUser(req.body.username, req.body.password);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Error registering user:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error registering user: ${err.message}` });
  }
});

app.put('/qresp_api/user', async (req, res) => {
  try {
    const user = await userExists(req.body.username);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    await updateUser(req.body.username, req.body.password);
    res.status(200).json({ message: 'User updated' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: `Error updating user: ${err.message}` });
  }
});

app.delete('/qresp_api/user', async (req, res) => {
  try {
    await deleteUser(req.body.username);
    res.status(204).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: `Error deleting user: ${err.message}` });
  }
});

app.get('/qresp_api/patient', async (req, res) => {
  try {
    const patient = await getPatient(req.body.username);
    res.status(200).json(patient);
  } catch (err) {
    console.error('Error getting patient:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error getting patient: ${err.message}` });
  }
});

app.post('/qresp_api/patient', async (req, res) => {
  try {
    const user = await userExists(req.body.username);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const age = parseInt((new Date().getFullYear()) - (new Date(req.body.birth).getFullYear()));
    await createPatient(req.body.username, req.body.dni, req.body.name, req.body.last_name, req.body.birth, req.body.tel, req.body.gender, age);
    res.status(201).json({ message: 'Patient registered' });
  } catch (err) {
    console.error('Error creating patient:', err);
    console.error('Data provided:', req.body);
    res.status(500).json({ message: `Error creating patient: ${err.message}` });
  }
});

app.put('/qresp_api/patient', async (req, res) => {
  try {
    const user = await userExists(req.body.username);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const age = new Date().getFullYear() - new Date(req.body.birth).getFullYear();
    await updatePatient(req.body.username, req.body.dni, req.body.name, req.body.last_name, req.body.birth, req.body.tel, req.body.gender, age);
    res.status(200).json({ message: 'Patient updated' });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ message: `Error updating patient: ${err.message}` });
  }
});

app.use((req, res) => {
  res.status(404).send('<h1>404 - Página no encontrada</h1>');
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + BASE_URL);
});
