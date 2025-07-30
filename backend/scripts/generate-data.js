const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

// Configuración
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const COUNTRIES = ['Chile', 'Argentina', 'México', 'Colombia', 'Perú', 'Brasil', 'Uruguay', 'Ecuador', 'Bolivia', 'Paraguay'];
const AGENTS = ['XYZ', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'YZA'];
const NAMES = [
  'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez',
  'Carmen González', 'Roberto Silva', 'Patricia Torres', 'Miguel Herrera', 'Sofia Vargas',
  'Diego Morales', 'Valentina Castro', 'Andrés Jiménez', 'Camila Ruiz', 'Felipe Mendoza',
  'Isabella Rojas', 'Sebastián Guzmán', 'Valeria Salazar', 'Nicolás Vega', 'Daniela Flores'
];

// Función para encriptar texto
function encryptText(text) {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

// Función para generar fecha aleatoria
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Función para generar monto aleatorio
function randomAmount() {
  // 20% de probabilidad de monto negativo o nulo para probar validaciones
  if (Math.random() < 0.2) {
    return Math.random() < 0.5 ? -Math.random() * 1000 : null;
  }
  return Math.random() * 10000 + 100;
}

// Generar artículos
function generateArticles(count) {
  const articles = [];
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2025-12-31');

  for (let i = 1; i <= count; i++) {
    const date = randomDate(startDate, endDate);
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const encryptedName = encryptText(name);
    
    articles.push({
      id: `ART-${String(i).padStart(5, '0')}`,
      date: date.toISOString(),
      name: encryptedName,
      originalAmount: randomAmount(),
      country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
      agent: AGENTS[Math.floor(Math.random() * AGENTS.length)]
    });
  }

  return articles;
}

// Generar y guardar datos
console.log('Generando 10,000 artículos...');
const articles = generateArticles(10000);

const outputPath = path.join(__dirname, '../data/articles.json');
fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));

console.log(`✅ Se generaron ${articles.length} artículos en: ${outputPath}`);
console.log('📊 Estadísticas:');
console.log(`- Artículos con montos negativos/nulos: ${articles.filter(a => a.originalAmount <= 0).length}`);
console.log(`- Artículos con agente XYZ: ${articles.filter(a => a.agent === 'XYZ').length}`);
console.log(`- Artículos de Chile: ${articles.filter(a => a.country === 'Chile').length}`);
console.log(`- Artículos con fechas futuras: ${articles.filter(a => new Date(a.date) > new Date()).length}`); 