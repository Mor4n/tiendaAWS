# Insertar productos de ejemplo en DynamoDB

Write-Host "🚀 Insertando productos de ejemplo en DynamoDB..." -ForegroundColor Green

$productsFile = Join-Path $PSScriptRoot ".." "products-sample.json"

if (-not (Test-Path $productsFile)) {
    Write-Host "❌ Error: No se encontró el archivo products-sample.json" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Insertando productos..." -ForegroundColor Cyan
aws dynamodb batch-write-item --request-items file://$productsFile --region us-east-2

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Productos insertados exitosamente!" -ForegroundColor Green
    
    # Verificar productos insertados
    Write-Host "`n📊 Verificando productos insertados..." -ForegroundColor Cyan
    $count = aws dynamodb scan --table-name Products --select COUNT --region us-east-2 | ConvertFrom-Json
    Write-Host "Total de productos: $($count.Count)" -ForegroundColor Green
} else {
    Write-Host "`n❌ Error al insertar productos" -ForegroundColor Red
}
