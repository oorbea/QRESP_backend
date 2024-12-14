import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
dotenv.config();

function generatePermanentToken (username, password) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ username, password }, secret);
}

const PORT = process.env.PORT ?? 1000;
const BASE_URL = `http://localhost:${PORT}`;

async function generatePermanentQR (username, password) {
  const token = generatePermanentToken(username, password);
  const loginURL = `${BASE_URL}/qresp_api/login?token=${token}`;
  const qrCode = await QRCode.toDataURL(loginURL);
  return qrCode;
}

export { generatePermanentQR };
