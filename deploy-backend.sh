#!/bin/bash
# Script de despliegue para backend en EC2

echo "🚀 Desplegando backend a EC2..."

# Variables
EC2_USER="ec2-user"
EC2_IP="3.132.5.0"
BACKEND_PATH="/var/www/backend"
LOCAL_BACKEND="./backend"

echo "📦 Preparando archivos..."
cd backend

echo "🔄 Subiendo archivos a EC2..."
scp -r ./* ${EC2_USER}@${EC2_IP}:${BACKEND_PATH}/

echo "📥 Instalando dependencias en EC2..."
ssh ${EC2_USER}@${EC2_IP} << 'EOF'
cd /var/www/backend
echo "Installing npm packages..."
npm install

echo "🔄 Reiniciando PM2..."
pm2 stop backend || true
pm2 delete backend || true
pm2 start index.js --name backend

echo "✅ Backend desplegado!"
pm2 status
pm2 logs backend --lines 20
EOF

echo ""
echo "✅ Despliegue completado!"
echo "🔗 Backend: http://${EC2_IP}:3000"
