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
    // Generar token permanente (puedes modificar esta función según tu implementación)
    const token = generatePermanentToken(username, password);

    // Crear la URL de inicio de sesión
    const loginURL = `${BASE_URL}/qresp_api/login?token=${token}`;

    // Generar el QR como un buffer de imagen
    const qrBuffer = await QRCode.toBuffer(loginURL);

    // Crear el directorio ./qr si no existe
    const qrDirectory = path.normalize('../QRESP_frontend/src/qr');
    if (!fs.existsSync(qrDirectory)) {
      fs.mkdirSync(qrDirectory, { recursive: true });
    }

    // Definir el nombre del archivo (username.jpg)
    const qrFilePath = path.normalize(path.join(qrDirectory, `${username}.jpg`));

    // Guardar el buffer como archivo .jpg
    fs.writeFileSync(qrFilePath, qrBuffer);

    console.log(`QR generado y guardado en: ${qrFilePath}`);
    return qrFilePath; // Opcionalmente, devolver la ruta del archivo
  } catch (err) {
    console.error('Error al generar o guardar el QR:', err);
    throw err;
  }
}

export { generateAndSaveQR };
