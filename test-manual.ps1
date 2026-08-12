# ============================================================
# WashFlow - Manual CRUD Test Commands (Auto-Capture IDs)
# Copy-paste each block one by one into PowerShell
# IDs are automatically captured - no manual pasting needed!
# ============================================================


# ════════════════════════════════════════
# STEP 1: HEALTH CHECKS (paste all 4)
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8080/actuator/health"
Invoke-RestMethod -Uri "http://localhost:8081/health"
Invoke-RestMethod -Uri "http://localhost:8082/health"
Invoke-RestMethod -Uri "http://localhost:8083/health"


# ════════════════════════════════════════
# STEP 2: REGISTER USER (auto-captures $userId)
# Run this line FIRST to generate a unique email:
# ════════════════════════════════════════

$ts = Get-Date -Format "HHmmss"; $email = "sajini${ts}@washflow.com"; Write-Host "Using email: $email"

$reg = Invoke-RestMethod -Uri "http://localhost:8080/auth/register" -Method Post -ContentType "application/json" -Body ('{"name":"Sajini Perera","email":"' + $email + '","password":"mypass123"}'); $userId = $reg.id; Write-Host "User registered! userId = $userId"; $reg


# ════════════════════════════════════════
# STEP 3: LOGIN (auto-captures $jwt)
# ════════════════════════════════════════

$login = Invoke-RestMethod -Uri "http://localhost:8080/oauth/token" -Method Post -ContentType "application/json" -Body ('{"email":"' + $email + '","password":"mypass123"}'); $jwt = $login.accessToken; Write-Host "Logged in! JWT saved to variable"; $login


# ════════════════════════════════════════
# STEP 4: GET USER PROFILE
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8080/users/$userId" -Method Get -Headers @{ Authorization = "Bearer $jwt" }


# ════════════════════════════════════════
# STEP 5: UPDATE USER PROFILE
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8080/users/$userId" -Method Put -Headers @{ Authorization = "Bearer $jwt" } -ContentType "application/json" -Body ('{"name":"Sajini Updated","email":"' + $email + '"}')


# ════════════════════════════════════════
# STEP 6: LIST ALL LAUNDRY SERVICES
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8082/services" -Method Get -Headers @{ "X-API-KEY" = "washflow-laundry-dev-key-2026" }


# ════════════════════════════════════════
# STEP 7: CREATE LAUNDRY SERVICE (auto-captures $serviceId)
# ════════════════════════════════════════

$svc = Invoke-RestMethod -Uri "http://localhost:8082/services" -Method Post -Headers @{ "X-API-KEY" = "washflow-laundry-dev-key-2026" } -ContentType "application/json" -Body '{"name":"Express Iron Press","description":"Quick 20-min iron press","price":500.00,"estimatedMinutes":20}'; $serviceId = $svc.id; Write-Host "Service created! serviceId = $serviceId"; $svc


# ════════════════════════════════════════
# STEP 8: GET ONE LAUNDRY SERVICE
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8082/services/$serviceId" -Method Get -Headers @{ "X-API-KEY" = "washflow-laundry-dev-key-2026" }


# ════════════════════════════════════════
# STEP 9: UPDATE LAUNDRY SERVICE
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8082/services/$serviceId" -Method Put -Headers @{ "X-API-KEY" = "washflow-laundry-dev-key-2026" } -ContentType "application/json" -Body '{"name":"Premium Iron Press","description":"Updated premium press","price":750.00,"estimatedMinutes":25}'


# ════════════════════════════════════════
# STEP 10: DELETE LAUNDRY SERVICE
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8082/services/$serviceId" -Method Delete -Headers @{ "X-API-KEY" = "washflow-laundry-dev-key-2026" }; Write-Host "Service deleted successfully (204)"


# ════════════════════════════════════════
# STEP 11: CREATE ORDER (auto-captures $orderId)
# ════════════════════════════════════════

$ord = Invoke-RestMethod -Uri "http://localhost:8083/orders" -Method Post -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" } -ContentType "application/json" -Body ('{"serviceId":"srv-001","serviceName":"Wash and Fold","weightKg":4.0,"pickupDate":"2026-12-25","address":"45 Galle Road, Colombo","userId":"' + $userId + '"}'); $orderId = $ord.id; Write-Host "Order created! orderId = $orderId"; $ord


# ════════════════════════════════════════
# STEP 12: GET ALL ORDERS
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders" -Method Get -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" }


# ════════════════════════════════════════
# STEP 13: GET ONE ORDER
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders/$orderId" -Method Get -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" }


# ════════════════════════════════════════
# STEP 14: UPDATE ORDER -> PICKUP_SCHEDULED
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders/$orderId" -Method Put -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" } -ContentType "application/json" -Body '{"status":"PICKUP_SCHEDULED"}'


# ════════════════════════════════════════
# STEP 15: UPDATE ORDER -> PICKED_UP
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders/$orderId" -Method Put -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" } -ContentType "application/json" -Body '{"status":"PICKED_UP"}'


# ════════════════════════════════════════
# STEP 16: UPDATE ORDER -> WASHING
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders/$orderId" -Method Put -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" } -ContentType "application/json" -Body '{"status":"WASHING"}'


# ════════════════════════════════════════
# STEP 17: UPDATE ORDER -> READY_FOR_DELIVERY
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders/$orderId" -Method Put -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" } -ContentType "application/json" -Body '{"status":"READY_FOR_DELIVERY"}'


# ════════════════════════════════════════
# STEP 18: UPDATE ORDER -> OUT_FOR_DELIVERY
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders/$orderId" -Method Put -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" } -ContentType "application/json" -Body '{"status":"OUT_FOR_DELIVERY"}'


# ════════════════════════════════════════
# STEP 19: UPDATE ORDER -> DELIVERED
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders/$orderId" -Method Put -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" } -ContentType "application/json" -Body '{"status":"DELIVERED"}'


# ════════════════════════════════════════
# STEP 20: GET ORDERS BY USER ID
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders?userId=$userId" -Method Get -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" }


# ════════════════════════════════════════
# STEP 21: DELETE ORDER
# ════════════════════════════════════════

Invoke-RestMethod -Uri "http://localhost:8083/orders/$orderId" -Method Delete -Headers @{ "X-API-KEY" = "washflow-order-pickup-dev-key-2026" }; Write-Host "Order deleted successfully (204)"
