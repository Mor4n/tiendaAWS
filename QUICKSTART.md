# 🚀 Guía de Inicio Rápido - TiendaAWS

Esta guía te llevará desde cero hasta tener el proyecto completamente funcional en AWS.

## ⏱️ Tiempo estimado: 30-45 minutos

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener:

- [ ] Cuenta de AWS activa
- [ ] AWS CLI instalado y configurado
- [ ] Node.js 18+ instalado
- [ ] Git instalado
- [ ] Editor de código (VS Code recomendado)

### Verificar prerequisitos:

```powershell
# Verificar AWS CLI
aws --version

# Verificar Node.js
node --version

# Verificar npm
npm --version

# Configurar AWS CLI (si no está configurado)
aws configure
```

---

## 🎯 Paso 1: Clonar y Configurar Proyecto (5 min)

```powershell
# 1. Clonar repositorio
git clone https://github.com/Mor4n/tiendaAWS.git
cd tiendaAWS

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Instalar dependencias del frontend
cd ../frontend
npm install
cd ..
```

---

## 🗄️ Paso 2: Configurar DynamoDB (5 min)

```powershell
# Opción A: Usar script automático
cd aws-scripts
.\setup-dynamodb.ps1
.\insert-products.ps1

# Opción B: Manual
# Ver instrucciones en README.md principal
```

**Verificar:**
```powershell
aws dynamodb list-tables --region us-east-2
# Deberías ver: Products, Orders
```

---

## 🔐 Paso 3: Configurar AWS Cognito (5 min)

### Crear User Pool:

```powershell
# 1. Crear User Pool
aws cognito-idp create-user-pool `
    --pool-name tienda-aws-users `
    --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true}" `
    --auto-verified-attributes email `
    --region us-east-2
```

**Guarda el User Pool ID que aparece en la respuesta!**

### Crear App Client:

```powershell
# 2. Crear App Client (reemplaza USER_POOL_ID)
aws cognito-idp create-user-pool-client `
    --user-pool-id us-east-2_XXXXXXXXX `
    --client-name tienda-web-client `
    --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH ALLOW_USER_SRP_AUTH `
    --region us-east-2
```

**Guarda el Client ID que aparece en la respuesta!**

---

## 💻 Paso 4: Configurar Backend (5 min)

```powershell
cd backend

# Crear archivo .env
@"
AWS_REGION=us-east-2
PRODUCTS_TABLE=Products
ORDERS_TABLE=Orders
PORT=3000
"@ | Out-File -FilePath .env -Encoding UTF8

# Probar backend localmente
npm start
```

**Verificar:** Abre http://localhost:3000/products en tu navegador

---

## 🎨 Paso 5: Configurar Frontend (5 min)

```powershell
cd frontend

# Crear archivo .env (REEMPLAZA CON TUS VALORES)
@"
VITE_API_URL=http://localhost:3000
VITE_COGNITO_USER_POOL_ID=us-east-2_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_REGION=us-east-2
"@ | Out-File -FilePath .env -Encoding UTF8

# Iniciar frontend
npm run dev
```

**Verificar:** Abre http://localhost:5173 en tu navegador

---

## ☁️ Paso 6: Desplegar en AWS (15-20 min)

### A. Crear instancia EC2

```powershell
# 1. Crear Security Group
aws ec2 create-security-group `
    --group-name tienda-aws-sg `
    --description "Security group for TiendaAWS backend" `
    --region us-east-2

# Guardar el GroupId que devuelve!

# 2. Agregar reglas al Security Group
$SG_ID = "sg-XXXXXXXXX"  # Reemplaza con tu GroupId

# Permitir SSH (solo desde tu IP)
$MI_IP = (Invoke-WebRequest -Uri "https://api.ipify.org").Content
aws ec2 authorize-security-group-ingress `
    --group-id $SG_ID `
    --protocol tcp --port 22 `
    --cidr "$MI_IP/32" `
    --region us-east-2

# Permitir HTTP (puerto 3000 para el backend)
aws ec2 authorize-security-group-ingress `
    --group-id $SG_ID `
    --protocol tcp --port 3000 `
    --cidr 0.0.0.0/0 `
    --region us-east-2

# 3. Crear rol IAM para EC2
aws iam create-role `
    --role-name EC2-DynamoDB-Role `
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "ec2.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }]
    }'

# 4. Adjuntar política de DynamoDB
aws iam attach-role-policy `
    --role-name EC2-DynamoDB-Role `
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# 5. Crear instance profile
aws iam create-instance-profile --instance-profile-name EC2-DynamoDB-Profile
aws iam add-role-to-instance-profile `
    --instance-profile-name EC2-DynamoDB-Profile `
    --role-name EC2-DynamoDB-Role

# 6. Lanzar instancia EC2
aws ec2 run-instances `
    --image-id ami-0c55b159cbfafe1f0 `
    --instance-type t2.micro `
    --key-name tu-key-pair `
    --security-group-ids $SG_ID `
    --iam-instance-profile Name=EC2-DynamoDB-Profile `
    --region us-east-2 `
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=TiendaAWS-Backend}]'
```

### B. Configurar EC2

```powershell
# 1. Obtener IP pública
$INSTANCE_ID = "i-XXXXXXXXX"  # Reemplaza con tu Instance ID
$EC2_IP = aws ec2 describe-instances `
    --instance-ids $INSTANCE_ID `
    --query 'Reservations[0].Instances[0].PublicIpAddress' `
    --output text `
    --region us-east-2

Write-Host "IP de EC2: $EC2_IP"

# 2. Conectar por SSH
ssh -i "tu-key.pem" ec2-user@$EC2_IP

# 3. En la instancia EC2, ejecutar:
sudo yum update -y
sudo yum install -y nodejs npm git
sudo npm install -g pm2

# 4. Clonar proyecto
git clone https://github.com/Mor4n/tiendaAWS.git
cd tiendaAWS/backend
npm install

# 5. Configurar .env
cat > .env << EOF
AWS_REGION=us-east-2
PRODUCTS_TABLE=Products
ORDERS_TABLE=Orders
PORT=3000
EOF

# 6. Iniciar con PM2
pm2 start index.js --name backend
pm2 save
pm2 startup
```

### C. Desplegar Frontend en S3

```powershell
# 1. Actualizar .env del frontend con la IP de EC2
@"
VITE_API_URL=http://$EC2_IP:3000
VITE_COGNITO_USER_POOL_ID=us-east-2_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_REGION=us-east-2
"@ | Out-File -FilePath frontend/.env -Encoding UTF8

# 2. Build del frontend
cd frontend
npm run build

# 3. Crear bucket S3
$BUCKET_NAME = "frontend-tienda-$(Get-Random)"
aws s3 mb s3://$BUCKET_NAME --region us-east-2

# 4. Configurar como sitio web
aws s3 website s3://$BUCKET_NAME `
    --index-document index.html `
    --error-document index.html

# 5. Subir archivos
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# 6. Hacer público
$POLICY = @"
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
  }]
}
"@
$POLICY | Out-File -FilePath bucket-policy.json -Encoding UTF8
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

Write-Host "`n✅ Frontend desplegado en: http://$BUCKET_NAME.s3-website.us-east-2.amazonaws.com"
```

---

## ✅ Verificación Final

### 1. Backend funcionando:
```powershell
curl http://$EC2_IP:3000/products
# Debería devolver la lista de productos
```

### 2. Frontend funcionando:
Abre en tu navegador: `http://TU-BUCKET.s3-website.us-east-2.amazonaws.com`

### 3. Probar funcionalidades:
- [ ] Ver productos
- [ ] Registrar usuario
- [ ] Confirmar email (revisa tu correo)
- [ ] Iniciar sesión
- [ ] Añadir productos al carrito
- [ ] Realizar pedido
- [ ] Ver historial de pedidos

---

## 🎉 ¡Listo!

Tu e-commerce está completamente funcional en AWS.

### 🚀 Próximos pasos:

1. **Configurar CloudFront** para mejor rendimiento
2. **Configurar dominio personalizado** con Route 53
3. **Agregar SNS** para notificaciones
4. **Configurar GitHub Actions** para CI/CD automático

### 📚 Recursos:

- [README Principal](../README.md)
- [Frontend README](../frontend/README.md)
- [AWS Documentation](https://docs.aws.amazon.com/)

### 🐛 ¿Problemas?

Revisa el [Troubleshooting](../frontend/README.md#troubleshooting) en la documentación del frontend.

---

**¡Felicidades! Has desplegado exitosamente un e-commerce completo en AWS** 🎊
