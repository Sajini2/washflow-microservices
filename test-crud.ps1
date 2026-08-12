# ============================================================
# WashFlow Microservices - Full CRUD Terminal Test Script
# Run:  powershell -ExecutionPolicy Bypass -File test-crud.ps1
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  WashFlow - Full CRUD Terminal Tests   " -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# ----------------------------------------------------------
# HEALTH CHECKS
# ----------------------------------------------------------
Write-Host "--- HEALTH CHECKS ---" -ForegroundColor Yellow

Write-Host "[1/4] Gateway (8080)..." -NoNewline
$gw = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health"
Write-Host " $($gw.status)" -ForegroundColor Green

Write-Host "[2/4] User Auth Service (8081)..." -NoNewline
$ua = Invoke-RestMethod -Uri "http://localhost:8081/health"
Write-Host " $($ua.status)" -ForegroundColor Green

Write-Host "[3/4] Laundry Service (8082)..." -NoNewline
$ls = Invoke-RestMethod -Uri "http://localhost:8082/health"
Write-Host " $($ls.status)" -ForegroundColor Green

Write-Host "[4/4] Order Pickup Service (8083)..." -NoNewline
$op = Invoke-RestMethod -Uri "http://localhost:8083/health"
Write-Host " $($op.status)" -ForegroundColor Green

Write-Host ""

# ----------------------------------------------------------
# VARIABLES
# ----------------------------------------------------------
$lHeaders = @{ "X-API-KEY" = "washflow-laundry-dev-key-2026" }
$oHeaders = @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" }

# ----------------------------------------------------------
# USER AUTH SERVICE CRUD (via Gateway :8080)
# ----------------------------------------------------------
Write-Host "--- USER AUTH SERVICE CRUD ---" -ForegroundColor Yellow

$ts = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "testuser${ts}@washflow.com"

# CREATE - Register
Write-Host "[POST] /auth/register ..." -NoNewline
$regBody = @{ name = "Test User"; email = $testEmail; password = "password123" } | ConvertTo-Json
$regRes = Invoke-RestMethod -Uri "http://localhost:8080/auth/register" -Method Post -ContentType "application/json" -Body $regBody
$userId = $regRes.id
Write-Host " OK  id=$userId" -ForegroundColor Green

# LOGIN - JWT Token
Write-Host "[POST] /oauth/token ..." -NoNewline
$loginBody = @{ email = $testEmail; password = "password123" } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/oauth/token" -Method Post -ContentType "application/json" -Body $loginBody
$jwt = $loginRes.accessToken
$jwtShort = $jwt.Substring(0, [Math]::Min(40, $jwt.Length))
Write-Host " OK  jwt=${jwtShort}..." -ForegroundColor Green

$authHeaders = @{ Authorization = "Bearer $jwt" }

# READ - Profile
Write-Host "[GET]  /users/$userId ..." -NoNewline
$profileRes = Invoke-RestMethod -Uri "http://localhost:8080/users/$userId" -Method Get -Headers $authHeaders
Write-Host " OK  name=$($profileRes.name)" -ForegroundColor Green

# UPDATE - Profile
Write-Host "[PUT]  /users/$userId ..." -NoNewline
$updBody = @{ name = "Updated Test User"; email = $testEmail } | ConvertTo-Json
$updRes = Invoke-RestMethod -Uri "http://localhost:8080/users/$userId" -Method Put -Headers $authHeaders -ContentType "application/json" -Body $updBody
Write-Host " OK  name=$($updRes.name)" -ForegroundColor Green

Write-Host ""

# ----------------------------------------------------------
# LAUNDRY CATALOG SERVICE CRUD (direct :8082)
# ----------------------------------------------------------
Write-Host "--- LAUNDRY SERVICE CRUD ---" -ForegroundColor Yellow

# READ ALL
Write-Host "[GET]  /services (list all) ..." -NoNewline
$raw = Invoke-RestMethod -Uri "http://localhost:8082/services" -Method Get -Headers $lHeaders
$allSvc = @($raw)
Write-Host " OK  found $($allSvc.Count) service(s)" -ForegroundColor Green

# CREATE
Write-Host "[POST] /services (create) ..." -NoNewline
$cBody = @{ name = "Terminal Test Wash"; description = "Created via test script"; price = 850.00; estimatedMinutes = 40 } | ConvertTo-Json
$newSvc = Invoke-RestMethod -Uri "http://localhost:8082/services" -Method Post -Headers $lHeaders -ContentType "application/json" -Body $cBody
$svcId = $newSvc.id
Write-Host " OK  id=$svcId" -ForegroundColor Green

# READ ONE
Write-Host "[GET]  /services/$svcId (read) ..." -NoNewline
$svcD = Invoke-RestMethod -Uri "http://localhost:8082/services/$svcId" -Method Get -Headers $lHeaders
Write-Host " OK  name=$($svcD.name)  price=$($svcD.price)" -ForegroundColor Green

# UPDATE
Write-Host "[PUT]  /services/$svcId (update) ..." -NoNewline
$uBody = @{ name = "Terminal Wash Pro"; description = "Updated via script"; price = 950.00; estimatedMinutes = 35 } | ConvertTo-Json
$uSvc = Invoke-RestMethod -Uri "http://localhost:8082/services/$svcId" -Method Put -Headers $lHeaders -ContentType "application/json" -Body $uBody
Write-Host " OK  name=$($uSvc.name)  price=$($uSvc.price)" -ForegroundColor Green

# DELETE
Write-Host "[DEL]  /services/$svcId (delete) ..." -NoNewline
Invoke-RestMethod -Uri "http://localhost:8082/services/$svcId" -Method Delete -Headers $lHeaders
Write-Host " OK  (204 No Content)" -ForegroundColor Green

Write-Host ""

# ----------------------------------------------------------
# ORDER PICKUP SERVICE CRUD (direct :8083)
# ----------------------------------------------------------
Write-Host "--- ORDER PICKUP SERVICE CRUD ---" -ForegroundColor Yellow

# CREATE Order (use hardcoded valid service data)
Write-Host "[POST] /orders (create) ..." -NoNewline
$ordBody = @{
    serviceId   = "srv-test-001"
    serviceName = "Standard Wash and Fold"
    weightKg    = 3.5
    pickupDate  = "2026-12-25"
    address     = "789 Temple Road, Kandy"
    userId      = $userId
} | ConvertTo-Json
$newOrd = Invoke-RestMethod -Uri "http://localhost:8083/orders" -Method Post -Headers $oHeaders -ContentType "application/json" -Body $ordBody
$ordId = $newOrd.id
Write-Host " OK  id=$ordId  status=$($newOrd.status)" -ForegroundColor Green

# READ ALL
Write-Host "[GET]  /orders (list all) ..." -NoNewline
$allOrd = @(Invoke-RestMethod -Uri "http://localhost:8083/orders" -Method Get -Headers $oHeaders)
Write-Host " OK  found $($allOrd.Count) order(s)" -ForegroundColor Green

# READ ONE
Write-Host "[GET]  /orders/$ordId (read) ..." -NoNewline
$ordD = Invoke-RestMethod -Uri "http://localhost:8083/orders/$ordId" -Method Get -Headers $oHeaders
Write-Host " OK  status=$($ordD.status)" -ForegroundColor Green

# UPDATE - Walk through full order lifecycle
$stages = @("PICKUP_SCHEDULED", "PICKED_UP", "WASHING", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY", "DELIVERED")
foreach ($stage in $stages) {
    Write-Host "[PUT]  /orders/$ordId -> $stage ..." -NoNewline
    $sBody = @{ status = $stage } | ConvertTo-Json
    $sRes = Invoke-RestMethod -Uri "http://localhost:8083/orders/$ordId" -Method Put -Headers $oHeaders -ContentType "application/json" -Body $sBody
    Write-Host " OK" -ForegroundColor Green
}

# READ BY USER
Write-Host "[GET]  /orders?userId=$userId (filter) ..." -NoNewline
$uOrd = @(Invoke-RestMethod -Uri "http://localhost:8083/orders?userId=$userId" -Method Get -Headers $oHeaders)
Write-Host " OK  found $($uOrd.Count) order(s)" -ForegroundColor Green

# DELETE
Write-Host "[DEL]  /orders/$ordId (delete) ..." -NoNewline
Invoke-RestMethod -Uri "http://localhost:8083/orders/$ordId" -Method Delete -Headers $oHeaders
Write-Host " OK  (204 No Content)" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  ALL CRUD TESTS PASSED SUCCESSFULLY!  " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""
