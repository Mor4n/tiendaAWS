# 🔧 Cómo Solucionar el Error de Network

## Problema
Tu frontend en CloudFront está intentando conectarse a `localhost:3000` en lugar de tu backend en EC2.

## Solución Rápida

### Opción 1: Usar GitHub Actions (Recomendado) ✅

1. **Ve a GitHub → Settings → Secrets and variables → Actions**

2. **Agrega/Actualiza estos secrets:**
   ```
   VITE_API_URL=http://TU-IP-EC2:3000
   ```

3. **Obtén la IP de tu EC2:**
   - Ve a AWS Console → EC2 → Instances
   - Copia la "Public IPv4 address" de tu instancia
   - Ejemplo: `http://3.145.123.456:3000`

4. **Haz push para desplegar:**
   ```powershell
   git add .
   git commit -m "Fix: Update API URL to EC2 IP"
   git push origin main
   ```

   GitHub Actions automáticamente:
   - Hará build con la IP correcta
   - Desplegará a S3
   - Invalidará CloudFront

### Opción 2: Manual (Deploy desde tu PC) 💻

1. **Obtén tu IP de EC2:**
   - Ve a: https://console.aws.amazon.com/ec2/
   - Selecciona tu instancia
   - Copia la "Public IPv4 address"

2. **Actualiza el archivo `.env`:**
   ```powershell
   # Edita frontend/.env
   # Reemplaza:
   VITE_API_URL=http://TU-IP-EC2-AQUI:3000
   ```

3. **Rebuild y Deploy:**
   ```powershell
   cd frontend
   npm run build
   aws s3 sync dist/ s3://TU-BUCKET/ --delete
   aws cloudfront create-invalidation --distribution-id TU-DIST-ID --paths "/*"
   ```

### Opción 3: Verificar que el Backend esté Corriendo 🖥️

Asegúrate de que tu backend en EC2 esté activo:

```bash
# Conecta a tu EC2 (SSH)
ssh -i "tu-key.pem" ec2-user@TU-IP-EC2

# Verifica que esté corriendo
pm2 status

# Si no está corriendo:
cd /var/www/backend
pm2 start index.js --name backend

# Ver logs
pm2 logs backend
```

## Verificar CORS en el Backend

Tu backend necesita permitir requests desde CloudFront:

```javascript
// backend/index.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://d1reehl64quwwb.cloudfront.net',
    'http://TU-BUCKET.s3-website.us-east-2.amazonaws.com'
  ],
  credentials: true
}));
```

## Verificar Security Group de EC2

Asegúrate de que el puerto 3000 esté abierto:

1. Ve a EC2 → Security Groups
2. Selecciona el SG de tu instancia
3. Verifica que tenga esta regla de entrada:
   - Type: Custom TCP
   - Port: 3000
   - Source: 0.0.0.0/0

## Probar la Conexión

```powershell
# Probar desde tu navegador:
http://TU-IP-EC2:3000/products

# Debería devolver JSON con productos
```

## Checklist de Troubleshooting

- [ ] Backend está corriendo en EC2 (pm2 status)
- [ ] Puerto 3000 abierto en Security Group
- [ ] CORS configurado para CloudFront
- [ ] `.env` tiene la IP correcta de EC2
- [ ] Hiciste rebuild del frontend (npm run build)
- [ ] Desplegaste el nuevo build a S3
- [ ] Invalidaste el cache de CloudFront

## ¿Aún no funciona?

Revisa los logs:
```bash
# En EC2
pm2 logs backend

# Ver errores
pm2 logs backend --err
```
