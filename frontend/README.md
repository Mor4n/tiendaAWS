# 🛒 TiendaAWS - Frontend React

Frontend moderno desarrollado con **React + Vite + Tailwind CSS** para el proyecto de e-commerce AWS CCP.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para API calls
- **AWS Cognito SDK** - Autenticación de usuarios
- **Zustand** - State management (opcional, puedes usar Context API)

## 📦 Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/          # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Cart.jsx
│   │   └── Profile.jsx
│   ├── context/        # Context providers
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── services/       # Servicios para API y Auth
│   │   ├── api.js
│   │   └── auth.js
│   ├── config/         # Configuración
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example        # Variables de entorno de ejemplo
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔧 Instalación y Configuración

### 1. Instalar Dependencias

```powershell
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://TU-EC2-IP:3000
VITE_COGNITO_USER_POOL_ID=us-east-2_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_REGION=us-east-2
```

**Cómo obtener los valores:**

#### API URL (Backend EC2)
```powershell
# Obtén la IP pública de tu instancia EC2
aws ec2 describe-instances --instance-ids i-XXXXXXXXX --query 'Reservations[0].Instances[0].PublicIpAddress'

# Tu URL será: http://IP-PUBLICA:3000
```

#### Cognito User Pool ID
```powershell
# Lista tus User Pools
aws cognito-idp list-user-pools --max-results 10

# O en la consola: AWS Console → Cognito → User Pools → General Settings
```

#### Cognito Client ID
```powershell
# Lista los app clients de tu User Pool
aws cognito-idp list-user-pool-clients --user-pool-id us-east-2_XXXXXXXXX

# O en la consola: AWS Console → Cognito → User Pools → App clients
```

### 3. Configurar Cognito App Client

**IMPORTANTE**: En tu Cognito User Pool, el App Client debe tener habilitado:

1. Ve a: AWS Console → Cognito → User Pools → App clients → tu app
2. En "Auth Flows Configuration", habilita:
   - ✅ `ALLOW_USER_PASSWORD_AUTH`
   - ✅ `ALLOW_REFRESH_TOKEN_AUTH`
   - ✅ `ALLOW_USER_SRP_AUTH`

### 4. Desarrollo Local

```powershell
npm run dev
```

El sitio estará disponible en: `http://localhost:5173`

### 5. Build para Producción

```powershell
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🚀 Despliegue en S3 + CloudFront

### Opción 1: Usando AWS CLI

```powershell
# 1. Build del proyecto
npm run build

# 2. Crear bucket S3 (si no existe)
aws s3 mb s3://frontend-tienda --region us-east-2

# 3. Configurar como sitio web estático
aws s3 website s3://frontend-tienda --index-document index.html --error-document index.html

# 4. Subir archivos
aws s3 sync dist/ s3://frontend-tienda/ --delete

# 5. Hacer el bucket público
aws s3api put-bucket-policy --bucket frontend-tienda --policy file://bucket-policy.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::frontend-tienda/*"
    }
  ]
}
```

### Opción 2: Usando GitHub Actions (Ya incluido en deploy.yml)

El workflow `.github/workflows/deploy.yml` ya incluye el despliegue del frontend:

```yaml
- name: Deploy Frontend to S3
  run: |
    aws s3 sync frontend/ s3://frontend-tienda/ --delete

- name: CloudFront Invalidation
  run: |
    aws cloudfront create-invalidation \
      --distribution-id ${{ secrets.CLOUDFRONT_ID }} \
      --paths "/*"
```

Solo necesitas configurar en GitHub:
- `secrets.CLOUDFRONT_ID` - ID de tu distribución de CloudFront

## 🎨 Características

### ✅ Autenticación con AWS Cognito
- Registro de usuarios con verificación por email
- Inicio de sesión
- Manejo de sesiones
- Protección de rutas

### ✅ Gestión de Productos
- Listado de productos desde DynamoDB
- Filtrado por categorías
- Información de stock en tiempo real
- Diseño responsive

### ✅ Carrito de Compras
- Añadir/eliminar productos
- Actualizar cantidades
- Persistencia en localStorage
- Cálculo automático de totales

### ✅ Perfil de Usuario
- Información personal
- Historial de pedidos
- Estados de pedidos

### ✅ Diseño Moderno
- Interfaz limpia con Tailwind CSS
- Totalmente responsive
- Animaciones suaves
- Componentes reutilizables

## 🔑 Endpoints del Backend

El frontend consume estos endpoints del backend en EC2:

```
GET  /products           - Lista todos los productos
GET  /products?category  - Filtra por categoría
POST /orders            - Crea un pedido (requiere auth)
GET  /orders?userId     - Lista pedidos del usuario (requiere auth)
```

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"
```powershell
# Verifica que el backend esté corriendo en EC2
curl http://TU-EC2-IP:3000/products

# Verifica que el Security Group de EC2 permita tráfico en puerto 3000
aws ec2 describe-security-groups --group-ids sg-XXXXXXXXX
```

### Error: "Cognito authentication failed"
```powershell
# Verifica la configuración del User Pool
aws cognito-idp describe-user-pool --user-pool-id us-east-2_XXXXXXXXX

# Verifica que el App Client tenga USER_PASSWORD_AUTH habilitado
aws cognito-idp describe-user-pool-client --user-pool-id us-east-2_XXXXXXXXX --client-id XXXXX
```

### CORS errors
El backend debe tener CORS habilitado:
```javascript
// backend/index.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://tu-dominio-cloudfront.net'],
  credentials: true
}));
```

## 📚 Scripts Disponibles

```powershell
npm run dev      # Inicia servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Ejecuta ESLint
```

## 🌟 Próximas Mejoras

- [ ] Notificaciones con SNS
- [ ] Búsqueda de productos
- [ ] Wishlist
- [ ] Reviews de productos
- [ ] Integración con Stripe para pagos
- [ ] PWA (Progressive Web App)
- [ ] Tests con Vitest

## 📝 Notas

- El proyecto usa Vite para desarrollo rápido y HMR
- Tailwind CSS permite desarrollo rápido de UI
- El carrito se guarda en localStorage
- Los tokens de Cognito se manejan automáticamente

## 🤝 Contribuir

Este es un proyecto educativo para AWS CCP. Siéntete libre de:
1. Hacer fork del proyecto
2. Crear una rama con tu feature
3. Hacer commit de tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Proyecto educativo - AWS CCP 2025
