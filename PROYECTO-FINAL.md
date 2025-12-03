# 🛒 E-Commerce con AWS - Documentación del Proyecto

## 📋 Descripción General

Sistema de e-commerce completamente funcional construido con tecnologías modernas y desplegado en AWS. El proyecto implementa autenticación segura con AWS Cognito, almacenamiento de productos y órdenes en DynamoDB, y despliegue automatizado con CI/CD.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO FINAL                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   CloudFront    │ (HTTPS)
                    │   CDN Global    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   S3 Bucket     │
                    │  (Frontend)     │
                    │  React + Vite   │
                    └─────────────────┘
                             │
                             │ API Calls
                             │
                    ┌────────▼────────┐
                    │  API Gateway    │ (HTTPS)
                    │   REST API      │
                    │   + CORS        │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   EC2 Instance  │
                    │  Node.js + PM2  │
                    │   Express API   │
                    └────┬────────┬───┘
                         │        │
            ┌────────────▼─┐   ┌─▼────────────┐
            │  DynamoDB    │   │ AWS Cognito  │
            │  Products    │   │ User Pool    │
            │  Orders      │   │ JWT Auth     │
            └──────────────┘   └──────────────┘
```

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18.2.0** - Framework UI moderno con hooks
- **Vite 5.4.21** - Build tool ultrarrápido
- **Tailwind CSS 3.3.6** - Framework CSS utility-first
- **React Router 6** - Navegación SPA
- **Axios 1.6.2** - Cliente HTTP con interceptors
- **Amazon Cognito Identity JS 6.3.7** - SDK de autenticación

### Backend
- **Node.js 18.20.8** - Runtime JavaScript
- **Express 4.18.2** - Framework web minimalista
- **AWS SDK 2.1400** - SDK oficial de AWS
- **jsonwebtoken 9.0.0** - Verificación JWT
- **jwks-rsa 3.1.0** - Validación de tokens con Cognito
- **PM2 6.0.14** - Process manager para producción
- **CORS 2.8.5** - Seguridad CORS configurada

### AWS Services
- **S3** - Hosting estático del frontend
- **CloudFront** - CDN global con HTTPS
- **EC2** - Servidor backend (Amazon Linux 2)
- **DynamoDB** - Base de datos NoSQL serverless
- **Cognito** - Autenticación y gestión de usuarios
- **API Gateway** - Proxy REST API con HTTPS
- **Systems Manager (SSM)** - Despliegue automatizado
- **IAM** - Gestión de permisos y roles

### DevOps
- **GitHub Actions** - CI/CD automatizado
- **Git** - Control de versiones

---

## 🔐 Seguridad Implementada

### 1. Autenticación con AWS Cognito
- ✅ Registro de usuarios con verificación por email
- ✅ Login con tokens JWT (ID Token)
- ✅ Verificación de tokens con claves públicas JWKS
- ✅ Validación de issuer y audience
- ✅ Expiración automática de sesiones

### 2. Protección de API
```javascript
// Middleware de verificación JWT con JWKS
const verifyToken = (req, res, next) => {
  jwt.verify(token, getSigningKey, {
    algorithms: ['RS256'],
    issuer: `https://cognito-idp.${region}.amazonaws.com/${poolId}`,
    audience: clientId
  }, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.sub;
    next();
  });
};
```

### 3. CORS Configurado
- API Gateway: Solo acepta requests desde CloudFront
- Backend: CORS configurado para CloudFront + localhost (desarrollo)

### 4. Seguridad de Red
- Security Group: Puerto 3000 abierto para API Gateway
- API Gateway: Proxy HTTPS hacia backend HTTP
- CloudFront: Forzar HTTPS en todas las conexiones

---

## 📊 Base de Datos (DynamoDB)

### Tabla: Products
```json
{
  "productId": "string (PK)",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string (GSI)",
  "stock": "number",
  "imageUrl": "string"
}
```
**Índice Secundario Global (GSI):** `CategoryIndex` para filtrar por categoría

### Tabla: Orders
```json
{
  "orderId": "string (PK)",
  "userId": "string (GSI)",
  "products": [
    {
      "productId": "string",
      "quantity": "number"
    }
  ],
  "total": "number",
  "status": "string",
  "createdAt": "string (ISO 8601)"
}
```
**Índice Secundario Global (GSI):** `UserOrdersIndex` para consultar órdenes por usuario

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Flujo Automatizado

```yaml
trigger: push a main
  │
  ├─► Frontend Build
  │   ├─ npm install
  │   ├─ npm run build (con variables de entorno)
  │   ├─ S3 sync (upload de archivos)
  │   └─ CloudFront invalidation (cache refresh)
  │
  └─► Backend Deploy
      ├─ tar.gz del código
      ├─ Upload a S3
      ├─ SSM RunShellScript en EC2
      │   ├─ Download desde S3
      │   ├─ Extraer archivos
      │   ├─ Crear .env con variables
      │   ├─ npm install --production
      │   └─ PM2 restart
      └─ Validación de deployment
```

### Variables de Entorno (GitHub Secrets)
```
VITE_API_URL
VITE_COGNITO_USER_POOL_ID
VITE_COGNITO_CLIENT_ID
VITE_COGNITO_REGION
VITE_CLOUDFRONT_URL
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
EC2_INSTANCE_ID
```

---

## 🌐 Endpoints de API

### Públicos
- `GET /health` - Health check del servidor
- `GET /products` - Lista todos los productos
- `GET /products?category={category}` - Filtrar por categoría

### Protegidos (requieren JWT)
- `POST /orders` - Crear nueva orden
- `GET /orders` - Obtener órdenes del usuario autenticado

### Ejemplo de Request Protegido
```javascript
// Headers
Authorization: Bearer eyJraWQiOiJlWUI0YzNW...

// Body (POST /orders)
{
  "products": [
    { "productId": "1", "quantity": 2 }
  ],
  "total": 99.98
}
```

---

## 📱 Funcionalidades del Frontend

### Páginas Implementadas
1. **Home** (`/`) - Catálogo de productos con filtros por categoría
2. **Login** (`/login`) - Autenticación con AWS Cognito
3. **Register** (`/register`) - Registro + verificación por código
4. **Cart** (`/cart`) - Carrito de compras persistente
5. **Profile** (`/profile`) - Historial de órdenes del usuario

### Componentes Reutilizables
- `Header` - Navegación con estado de autenticación
- `Footer` - Pie de página
- `Layout` - Wrapper con Header + Footer
- `ProductCard` - Tarjeta de producto
- `ProtectedRoute` - HOC para rutas autenticadas

### Context API
```javascript
// AuthContext - Gestión de autenticación
{
  user: Object,
  isAuth: boolean,
  login: (email, password) => Promise,
  logout: () => void,
  checkAuth: () => Promise
}

// CartContext - Gestión del carrito
{
  cart: Array,
  addToCart: (product) => void,
  removeFromCart: (productId) => void,
  updateQuantity: (productId, quantity) => void,
  clearCart: () => void,
  getTotalPrice: () => number
}
```

---

## 🎯 Características Destacadas

### 1. Persistencia del Carrito
El carrito se guarda en `localStorage`, mantiene el estado entre sesiones.

### 2. Autenticación Visual
Las páginas de Login y Register muestran claramente que usan AWS Cognito:
```jsx
<p className="text-sm text-gray-500 flex items-center gap-2">
  <ShieldIcon />
  Autenticación con AWS Cognito
</p>
```

### 3. Manejo de Errores
- Mensajes de error amigables
- Loading states en todas las operaciones async
- Validación de formularios

### 4. Responsive Design
Todo el sitio es completamente responsive gracias a Tailwind CSS:
- Mobile first
- Breakpoints: sm, md, lg, xl
- Grid adaptativo de productos

---

## 📈 Datos de Ejemplo

### 15 Productos Insertados en DynamoDB
| Categoría     | Ejemplos                                    |
|---------------|---------------------------------------------|
| Electronics   | Laptop Dell, Smartphone Samsung, AirPods   |
| Clothing      | Sudadera Nike, Jeans Levi's, Sneakers      |
| Books         | AWS CCP Study Guide, Clean Code, Sapiens   |
| Home          | Aspiradora Robot, Cafetera, Smart Speaker  |
| Sports        | Bicicleta, Balón FIFA, Yoga Mat            |
| Toys          | LEGO Star Wars, Nintendo Switch            |

---

## 🔧 Configuración del Proyecto

### Variables de Entorno Backend (.env)
```env
AWS_REGION=us-east-2
PRODUCTS_TABLE=Products
ORDERS_TABLE=Orders
COGNITO_POOL_ID=us-east-2_bM8G4VUFZ
COGNITO_CLIENT_ID=4u537dcuk8o8cc1on9vubhortf
PORT=3000
```

### Variables de Entorno Frontend (.env)
```env
VITE_API_URL=https://wfbcg5b1ka.execute-api.us-east-2.amazonaws.com/prod
VITE_COGNITO_USER_POOL_ID=us-east-2_bM8G4VUFZ
VITE_COGNITO_CLIENT_ID=4u537dcuk8o8cc1on9vubhortf
VITE_COGNITO_REGION=us-east-2
VITE_CLOUDFRONT_URL=https://d1reehl64quwwb.cloudfront.net
```

---

## 🚀 URLs del Proyecto

- **Frontend (CloudFront):** https://d1reehl64quwwb.cloudfront.net
- **API Gateway:** https://wfbcg5b1ka.execute-api.us-east-2.amazonaws.com/prod
- **Backend EC2:** http://3.132.5.0:3000 (acceso directo no recomendado)

---

## 📝 Comandos Útiles

### Desarrollo Local - Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # Generar dist/
npm run preview    # Preview de producción
```

### Desarrollo Local - Backend
```bash
cd backend
npm install
node index.js      # http://localhost:3000
```

### Despliegue Manual
```bash
# Commit y push activa GitHub Actions automáticamente
git add .
git commit -m "Deploy changes"
git push origin main
```

### Ver Logs del Backend en EC2
```bash
# Desde AWS CloudShell
aws ssm send-command \
  --instance-ids "i-0af4a1c84ac4a4a95" \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=["sudo -u ec2-user bash -c \"cat /home/ec2-user/.pm2/logs/backend-out.log | tail -50\""]' \
  --region us-east-2
```

---

## 🎓 Conceptos de AWS Aplicados

### 1. Compute
- **EC2**: Servidor virtual para backend
- **Lambda-like approach**: API Gateway + EC2 (podría migrarse a Lambda)

### 2. Storage
- **S3**: Static hosting + artifacts storage
- **DynamoDB**: NoSQL database con GSI para queries eficientes

### 3. Networking
- **CloudFront**: CDN global, reduce latencia, HTTPS
- **API Gateway**: Proxy REST, rate limiting, CORS
- **Security Groups**: Firewall a nivel de instancia

### 4. Security & Identity
- **Cognito**: User pools, JWT tokens, JWKS
- **IAM**: Roles y políticas para EC2, SSM, DynamoDB
- **Systems Manager**: Acceso seguro sin SSH

### 5. Developer Tools
- **GitHub Actions + AWS**: CI/CD nativo en la nube

---

## 🏆 Logros del Proyecto

✅ **Arquitectura Serverless Híbrida**: Combina servicios serverless (DynamoDB, Cognito, API Gateway) con compute tradicional (EC2)

✅ **Seguridad Robusta**: JWT verificado con JWKS, CORS configurado, HTTPS en todos los endpoints públicos

✅ **CI/CD Completo**: Despliegue automático de frontend y backend en cada push

✅ **Escalabilidad**: DynamoDB auto-scaling, CloudFront global, API Gateway con rate limiting

✅ **Monitoreo**: Logs centralizados con PM2, health checks

✅ **Costo Optimizado**: Free tier eligible (DynamoDB on-demand, CloudFront, Cognito)

---

## 📚 Referencias y Documentación

- [AWS DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js Guide](https://expressjs.com/)

---

## 👨‍💻 Autor

**Proyecto desarrollado para el curso de AWS Cloud Computing**

Fecha: Diciembre 2025

---

## 📄 Licencia

Este proyecto es de uso académico.

---

## 🔮 Posibles Mejoras Futuras

1. **Migrar backend a AWS Lambda** - Serverless completo
2. **Agregar AWS SES** - Emails de confirmación de órdenes
3. **Implementar AWS Amplify** - Simplificar autenticación
4. **CloudWatch Dashboards** - Métricas en tiempo real
5. **AWS WAF** - Protección adicional contra ataques
6. **RDS para órdenes complejas** - Relaciones SQL si es necesario
7. **ElastiCache** - Cache de productos frecuentes
8. **AWS SNS** - Notificaciones push de pedidos

---

**¡Proyecto completado exitosamente! 🎉**
