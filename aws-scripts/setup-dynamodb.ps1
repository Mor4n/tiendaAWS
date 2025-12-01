# Crear tablas de DynamoDB

Write-Host "🚀 Creando tablas de DynamoDB..." -ForegroundColor Green

# Crear tabla Products
Write-Host "`n📦 Creando tabla Products..." -ForegroundColor Cyan
aws dynamodb create-table `
    --table-name Products `
    --attribute-definitions `
        AttributeName=productId,AttributeType=S `
        AttributeName=category,AttributeType=S `
    --key-schema AttributeName=productId,KeyType=HASH `
    --global-secondary-indexes `
        "IndexName=CategoryIndex,KeySchema=[{AttributeName=category,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" `
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 `
    --region us-east-2

Write-Host "✅ Tabla Products creada!" -ForegroundColor Green

# Esperar a que la tabla esté activa
Write-Host "`n⏳ Esperando a que la tabla Products esté activa..." -ForegroundColor Yellow
aws dynamodb wait table-exists --table-name Products --region us-east-2

# Crear tabla Orders
Write-Host "`n📋 Creando tabla Orders..." -ForegroundColor Cyan
aws dynamodb create-table `
    --table-name Orders `
    --attribute-definitions `
        AttributeName=orderId,AttributeType=S `
        AttributeName=userId,AttributeType=S `
    --key-schema AttributeName=orderId,KeyType=HASH `
    --global-secondary-indexes `
        "IndexName=UserOrdersIndex,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" `
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 `
    --region us-east-2

Write-Host "✅ Tabla Orders creada!" -ForegroundColor Green

# Esperar a que la tabla esté activa
Write-Host "`n⏳ Esperando a que la tabla Orders esté activa..." -ForegroundColor Yellow
aws dynamodb wait table-exists --table-name Orders --region us-east-2

Write-Host "`n✨ ¡Todas las tablas de DynamoDB han sido creadas exitosamente!" -ForegroundColor Green
Write-Host "`n📌 Siguiente paso: Ejecuta .\insert-products.ps1 para insertar productos de ejemplo" -ForegroundColor Yellow
