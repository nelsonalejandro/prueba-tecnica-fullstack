const dotenv = require('dotenv');

// Cargar siempre el archivo .env principal
dotenv.config({ path: '.env' });

// Si ENCRYPTION_KEY no existe, usar una de prueba
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'clave-test';