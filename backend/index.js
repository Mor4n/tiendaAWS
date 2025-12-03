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

// Middleware Cognito
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, 'COGNITO_PUBLIC_KEY_O_JWK', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.sub;
    next();
  });
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
  const order = {
    orderId: Date.now().toString(),
    userId: req.userId,
    products: req.body.products,
    total: req.body.total,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  await createOrder(order);
  res.json(order);
});

app.get('/orders', verifyToken, async (req, res) => {
  const data = await getUserOrders(req.userId);
  res.json(data.Items);
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces (necesario para EC2)
app.listen(PORT, HOST, () => {
  console.log(`Backend running on http://${HOST}:${PORT}`);
  console.log('Ready to accept external connections');
});
