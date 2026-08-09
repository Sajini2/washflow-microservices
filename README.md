# Project Overview
To be added in a later step

# Architecture Diagram
To be added in a later step

# Team Members & Ownership
To be added in a later step

# Branching Strategy
To be added in a later step

# Prerequisites
To be added in a later step

# How to Run
To be added in a later step

# Swagger UI URLs
To be added in a later step

# API Key Header Format
Each microservice enforces direct request protection using its own unique API key:
- **Header Name**: `X-API-KEY` (all services)
- **Exempt Endpoint**: `GET /health` (no API key required)

### Service-Specific Environment Variable Mapping
- **User & Auth Service (`user-auth-service`)**: `USER_AUTH_SERVICE_API_KEY` (`service.api-key` in `application.properties`)
- **Laundry Service (`laundry-service`)**: `LAUNDRY_SERVICE_API_KEY`
- **Order Pickup Service (`order-pickup-service`)**: `ORDER_PICKUP_SERVICE_API_KEY`
- **Gateway (`gateway`)**: `GATEWAY_API_KEY`
