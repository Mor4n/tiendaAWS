require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { getProducts, createOrder, getUserOrders } = require('./utils/dynamo');

const app = express();

// Configurar JWKS client para verificar tokens de Cognito
const jwksUri = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}/.well-known/jwks.json`;
console.log('🔐 Configurando JWKS client:', jwksUri);

const client = jwksClient({
  jwksUri: jwksUri,
  cache: true,
  cacheMaxAge: 86400000 // 24 horas
});

// Función para obtener la clave pública
const getSigningKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

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

// Middleware Cognito - Verificación segura con JWKS
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.warn('⚠️  Request sin token');
    return res.status(401).json({ error: 'Token requerido' });
  }

  console.log('🔍 Verificando token JWT con Cognito JWKS...');
  
  // Verificar el token con las claves públicas de Cognito
  jwt.verify(token, getSigningKey, {
    algorithms: ['RS256'],
    issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}`,
    audience: process.env.COGNITO_CLIENT_ID
  }, (err, decoded) => {
    if (err) {
      console.error('❌ Token verificación fallida:', err.message);
      console.error('   Tipo de error:', err.name);
      return res.status(401).json({ 
        error: 'Token inválido o expirado',
        details: err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido'
      });
    }
    
    req.userId = decoded.sub;
    console.log('✅ Token verificado correctamente');
    console.log('   UserId:', req.userId);
    console.log('   Email:', decoded.email);
    console.log('   Issuer:', decoded.iss);
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
// Start server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces (necesario para EC2)
app.listen(PORT, HOST, () => {
  console.log('\n🚀 ========================================');
  console.log('   Backend running on http://' + HOST + ':' + PORT);
  console.log('🔐 JWT Verification: ENABLED (Cognito JWKS)');
  console.log('   Pool ID:', process.env.COGNITO_POOL_ID);
  console.log('   Client ID:', process.env.COGNITO_CLIENT_ID);
  console.log('   Region:', process.env.AWS_REGION);
  console.log('========================================\n');
});
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces (necesario para EC2)
app.listen(PORT, HOST, () => {
  console.log(`Backend running on http://${HOST}:${PORT}`);
  console.log('Ready to accept external connections');
});
