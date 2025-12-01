# Scripts de Configuración AWS

Este directorio contiene scripts útiles para configurar los servicios de AWS.

## 📋 Scripts Disponibles

### 1. setup-dynamodb.ps1
Crea las tablas de DynamoDB necesarias.

### 2. insert-products.ps1
Inserta productos de ejemplo en DynamoDB.

### 3. setup-cognito.ps1
Configura Cognito User Pool y App Client.

### 4. setup-s3-cloudfront.ps1
Crea bucket S3 y distribución de CloudFront.

## 🚀 Uso

```powershell
# Ejecutar desde la raíz del proyecto
cd aws-scripts

# Configurar DynamoDB
.\setup-dynamodb.ps1

# Insertar productos de ejemplo
.\insert-products.ps1

# Configurar Cognito
.\setup-cognito.ps1

# Configurar S3 y CloudFront
.\setup-s3-cloudfront.ps1
```

## ⚠️ Prerequisitos

- AWS CLI instalado y configurado
- Credenciales de AWS con permisos necesarios
- PowerShell 5.1 o superior
