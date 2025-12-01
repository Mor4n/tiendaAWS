# 🛒 TiendaAWS - E-commerce Completo en AWS

Proyecto completo de e-commerce construido con **React + Tailwind CSS** en el frontend y **Node.js + Express** en el backend, utilizando servicios de AWS para la certificación Cloud Practitioner (CCP).

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIOS / NAVEGADORES                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐              ┌────────────────┐
│   CloudFront   │              │    Cognito     │
│  (CDN Global)  │              │ (Autenticación)│
└───────┬────────┘              └────────┬───────┘
        │                                │
        ▼                                │
┌────────────────┐                       │
│   S3 Bucket    │                       │
│ (Frontend React)│                      │
└────────────────┘                       │
                                         │
        ┌────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────────┐
│              EC2 Instance                       │
│  ┌──────────────────────────────────────────┐ │
│  │  Node.js + Express Backend               │ │
│  │  - API REST                              │ │
│  │  - PM2 Process Manager                   │ │
│  └──────────────────────────────────────────┘ │
└────────┬──────────────────────┬────────────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│   DynamoDB      │    │   CloudWatch    │
│   - Products    │    │   - Logs        │
│   - Orders      │    │   - Monitoring  │
└─────────────────┘    └─────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Navegación SPA
- **AWS Cognito SDK** - Autenticación

### Backend
- **Node.js + Express** - API REST
- **AWS SDK** - Integración con DynamoDB
- **JWT** - Validación de tokens
- **PM2** - Process manager

### AWS Services
- ✅ **S3** + **CloudFront** - Hosting frontend
- ✅ **EC2** - Backend API
- ✅ **DynamoDB** - Base de datos NoSQL
- ✅ **Cognito** - Autenticación
- ✅ **IAM** - Permisos y roles
- ✅ **CloudWatch** - Monitoreo y logs
- ✅ **SNS** (opcional) - Notificaciones

## 📁 Estructura del Proyecto

```
tiendaAWS/
├── frontend/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas (Home, Login, etc.)
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── services/           # API y Auth services
│   │   └── config/             # Configuración AWS
│   ├── package.json
│   └── README.md               # 📖 Documentación del frontend
│
├── backend/                     # Node.js + Express
│   ├── index.js                # Servidor principal
│   ├── utils/dynamo.js         # Helpers de DynamoDB
│   └── package.json
│
└── .github/workflows/
    └── deploy.yml              # CI/CD automático
```

## 🚀 Inicio Rápido

### 1. Clonar e Instalar

```powershell
git clone https://github.com/Mor4n/tiendaAWS.git
cd tiendaAWS

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar Variables de Entorno

**Backend (.env):**
```env
AWS_REGION=us-east-2
PRODUCTS_TABLE=Products
ORDERS_TABLE=Orders
PORT=3000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000
VITE_COGNITO_USER_POOL_ID=us-east-2_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_REGION=us-east-2
```

### 3. Desarrollo Local

```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3000

## 📖 Documentación Completa

- [📘 Frontend README](./frontend/README.md) - Guía completa del frontend React
- [📗 Backend README](./backend/README.md) - Guía completa del backend

## 🎯 Despliegue en AWS

### Opción 1: GitHub Actions (Automático)

1. Configura los secretos en GitHub:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `EC2_INSTANCE_ID`
   - `CLOUDFRONT_ID`
   - Variables de Cognito

2. Push a la rama `main`:
```powershell
git add .
git commit -m "Deploy to AWS"
git push origin main
```

El workflow automáticamente:
- ✅ Construye el frontend React
- ✅ Despliega a S3
- ✅ Invalida cache de CloudFront
- ✅ Despliega backend a EC2
- ✅ Reinicia PM2

### Opción 2: Manual

Ver las guías completas en:
- [Frontend Deployment](./frontend/README.md#despliegue-en-s3--cloudfront)
- Backend Deployment (próximamente)

## 🎓 Servicios AWS para CCP

Este proyecto cubre los principales servicios para el examen AWS CCP:

| Servicio | Uso en el Proyecto | Categoría |
|----------|-------------------|-----------|
| **S3** | Hosting frontend estático | Storage |
| **CloudFront** | CDN global | Networking |
| **EC2** | Backend API | Compute |
| **DynamoDB** | Base de datos | Database |
| **Cognito** | Autenticación | Security |
| **IAM** | Roles y permisos | Security |
| **CloudWatch** | Logs y monitoreo | Monitoring |
| **Systems Manager** | Deployment | Management |

## 🌟 Características

### Frontend (React)
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Autenticación con AWS Cognito
- ✅ Carrito de compras persistente
- ✅ Filtrado de productos por categoría
- ✅ Responsive design
- ✅ Protected routes
- ✅ Context API para state management

### Backend (Node.js)
- ✅ API REST completa
- ✅ Validación de tokens JWT
- ✅ Integración con DynamoDB
- ✅ CORS configurado
- ✅ Endpoints protegidos
- ✅ Gestión de errores

## 🛠️ Comandos Útiles

```powershell
# Frontend
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview del build

# Backend
npm start            # Iniciar servidor
npm run dev          # Desarrollo con nodemon

# AWS CLI
aws dynamodb scan --table-name Products                    # Ver productos
aws s3 sync frontend/dist/ s3://frontend-tienda/ --delete  # Deploy frontend
aws cloudfront create-invalidation --distribution-id XXX   # Invalidar cache
```

## 🐛 Troubleshooting

### CORS Errors
Asegúrate de que el backend tenga CORS habilitado para tu dominio de CloudFront.

### Cognito Auth Errors
Verifica que el App Client tenga `USER_PASSWORD_AUTH` habilitado.

### DynamoDB Access Denied
Verifica que el rol de IAM de EC2 tenga permisos para DynamoDB.

Ver más en la [documentación del frontend](./frontend/README.md#troubleshooting).

## 📚 Recursos de Aprendizaje

- [AWS CCP Exam Guide](https://aws.amazon.com/certification/certified-cloud-practitioner/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DynamoDB Guide](https://docs.aws.amazon.com/dynamodb/)
- [Cognito User Pools](https://docs.aws.amazon.com/cognito/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Proyecto educativo - AWS Cloud Practitioner 2025

---

**Desarrollado con ❤️ para aprender AWS**
