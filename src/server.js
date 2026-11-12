const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.APP_PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'mongo-service';
const DB_NAME = process.env.DB_NAME || 'practica_db';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASS = process.env.DB_PASS || 'password123';

const uri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/${DB_NAME}?authSource=admin`;

app.get('/', async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();
    await client.close();

    res.json({
      status: 'OK',
      message: 'Backend conectado correctamente a MongoDB',
      database: DB_NAME,
      host: DB_HOST,
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'No se pudo conectar a MongoDB',
      error: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', port: PORT });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend escuchando en el puerto ${PORT}`);
  console.log(`Intentando conectar a MongoDB en: ${DB_HOST}`);
});