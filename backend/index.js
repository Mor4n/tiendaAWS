require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { getProducts, createOrder, getUserOrders } = require('./utils/dynamo');

const app = express();

// CORS configurado para solo permitir tu CloudFront
const allowedOrigins = [
  'https://d1reehl64quwwb.cloudfront.net',
  'http://localhost:5173', // Para desarrollo local
  'http://localhost:4173'  // Para preview local
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Blocked request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());

// Middleware Cognito - Versión simplificada
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  // Decodificar sin verificar (solo para desarrollo/demo)
  // En producción se debería verificar con las claves públicas de Cognito
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.userId = decoded.sub;
    console.log('✅ Usuario autenticado:', req.userId);
    next();
  } catch (err) {
    console.error('❌ Error al decodificar token:', err);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Endpoints
// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'backend-api',
    version: '1.0.0'
  });
});

app.get('/products', async (req, res) => {
  const category = req.query.category;
  const data = await getProducts(category);
  res.json(data.Items);
});

app.post('/orders', verifyToken, async (req, res) => {
  try {
    const order = {
      orderId: Date.now().toString(),
      userId: req.userId,
      products: req.body.products,
      total: req.body.total,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    console.log('📦 Creando orden:', order);
    await createOrder(order);
    console.log('✅ Orden creada exitosamente');
    res.json(order);
  } catch (err) {
    console.error('❌ Error al crear orden:', err);
    res.status(500).json({ error: 'Error al crear orden', details: err.message });
  }
});

app.get('/orders', verifyToken, async (req, res) => {
  try {
    console.log('📋 Obteniendo órdenes para usuario:', req.userId);
    const data = await getUserOrders(req.userId);
    console.log('✅ Órdenes encontradas:', data.Items?.length || 0);
    res.json(data.Items || []);
  } catch (err) {
    console.error('❌ Error al obtener órdenes:', err);
    res.status(500).json({ error: 'Error al obtener órdenes', details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces (necesario para EC2)
app.listen(PORT, HOST, () => {
  console.log(`Backend running on http://${HOST}:${PORT}`);
  console.log('Ready to accept external connections');
});
