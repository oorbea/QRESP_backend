import fs from 'fs';
import path from 'path';
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

/**
 * Genera un QR para login y guarda la imagen en el directorio ./qr
 * @param {string} username - El nombre del usuario para el archivo QR
 * @param {string} password - El identificador único del usuario
 */
async function generateAndSaveQR (username, password) {
  try {
    const token = generatePermanentToken(username, password);

    const loginURL = `${BASE_URL}/qresp_api/login?token=${token}`;

    const qrBuffer = await QRCode.toBuffer(loginURL);

    const qrDirectory = path.normalize('../QRESP_frontend/src/qr');
    if (!fs.existsSync(qrDirectory)) {
      fs.mkdirSync(qrDirectory, { recursive: true });
    }

    const qrFilePath = path.normalize(path.join(qrDirectory, `${username}.png`));

    fs.writeFileSync(qrFilePath, qrBuffer);

    return qrFilePath;
  } catch (err) {
    console.error('Error al generar o guardar el QR:', err);
    throw err;
  }
}

export { generateAndSaveQR };
