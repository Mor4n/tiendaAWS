// ===== Configuración de la Aplicación =====

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};

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
