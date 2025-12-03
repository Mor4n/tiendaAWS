# Script de despliegue para backend en EC2 (PowerShell)

Write-Host "🚀 Desplegando backend a EC2..." -ForegroundColor Cyan

# Variables
$EC2_USER = "ec2-user"
$EC2_IP = "3.132.5.0"
$BACKEND_PATH = "/var/www/backend"
$LOCAL_BACKEND = ".\backend"

Write-Host "`n📦 Preparando archivos..." -ForegroundColor Yellow

# Opción 1: Manual - Instrucciones
Write-Host "`n⚠️  Para desplegar el backend, ejecuta estos comandos en tu EC2:" -ForegroundColor Yellow
Write-Host "`nSSH a tu EC2:" -ForegroundColor White
Write-Host "  ssh $EC2_USER@$EC2_IP" -ForegroundColor Cyan

Write-Host "`nEn EC2, ejecuta:" -ForegroundColor White
Write-Host "  cd /var/www/backend" -ForegroundColor Cyan
Write-Host "  # Actualizar archivos (git pull o subir manualmente)" -ForegroundColor Gray
Write-Host "  npm install" -ForegroundColor Cyan
Write-Host "  pm2 stop backend" -ForegroundColor Cyan
Write-Host "  pm2 delete backend" -ForegroundColor Cyan
Write-Host "  pm2 start index.js --name backend" -ForegroundColor Cyan
Write-Host "  pm2 save" -ForegroundColor Cyan
Write-Host "  pm2 logs backend" -ForegroundColor Cyan

Write-Host "`n📋 Checklist de verificación:" -ForegroundColor Yellow
Write-Host "  ✓ Archivo .env existe en /var/www/backend" -ForegroundColor White
Write-Host "  ✓ npm install completado sin errores" -ForegroundColor White
Write-Host "  ✓ PM2 muestra status 'online'" -ForegroundColor White
Write-Host "  ✓ Security Group permite puerto 3000" -ForegroundColor White

Write-Host "`n🔍 Probar backend desde EC2:" -ForegroundColor Yellow
Write-Host "  curl http://localhost:3000/products" -ForegroundColor Cyan

Write-Host "`n🔍 Probar backend desde internet:" -ForegroundColor Yellow
Write-Host "  curl http://$EC2_IP`:3000/products" -ForegroundColor Cyan
