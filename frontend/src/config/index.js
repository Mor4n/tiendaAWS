// ===== Configuración de la Aplicación =====

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};

// 🐛 DEBUG: Log de configuración al cargar
console.log('⚙️ Environment Variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  VITE_COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID,
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});

console.log('🌐 API Config:', API_CONFIG);

export const COGNITO_CONFIG = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-2_XXXXXXXXX',
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  region: import.meta.env.VITE_COGNITO_REGION || 'us-east-2',
};

export const S3_CONFIG = {
  bucketName: import.meta.env.VITE_S3_BUCKET || 'tienda-productos-images',
  region: import.meta.env.VITE_S3_REGION || 'us-east-2',
  cloudFrontUrl: import.meta.env.VITE_CLOUDFRONT_URL || 'https://d1234567890.cloudfront.net',
};
