# WashFlow - Microservices Laundry Pickup & Delivery Platform

## Project Overview
WashFlow is a microservices-based laundry pickup and delivery platform designed for Service-Oriented Computing coursework. It features a distributed architecture with dedicated Spring Boot microservices, a shared API Gateway, a React frontend, and MongoDB Atlas database clusters per service.

## Architecture Diagram
```
+-----------------------------------------------------------------------+
|                            React Client                               |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                            API Gateway                                |
+-----------------------------------------------------------------------+
         |                         |                         |
         v                         v                         v
+------------------+     +------------------+     +--------------------+
| User Auth Service|     | Laundry Service  |     |Order Pickup Service|
+------------------+     +------------------+     +--------------------+
         |                         |                         |
         +-------------------------+-------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                     MongoDB Atlas (Shared Cluster)                    |
+-----------------------------------------------------------------------+
```

## Team Members & Ownership
- **ITBIN-2313-0043**: User & Auth Service + API Gateway
- **ITBIN-2313-0064**: Laundry Service
- **ITBIN-2313-0016**: Order & Pickup Service

## Branching Strategy
- `main`: Production and integration branch.
- `feature/0043-user-auth-gateway`: Owned by ITBIN-2313-0043 for User Auth Service and Gateway development.
- `feature/0064-laundry-service`: Owned by ITBIN-2313-0064 for Laundry Service development.
- `feature/0016-order-pickup-service`: Owned by ITBIN-2313-0016 for Order & Pickup Service development.

## Prerequisites
- Java 17 JDK or higher
- Maven 3.8+
- Node.js (v18+) & npm
- Docker & Docker Compose
- MongoDB Atlas cluster connection string

## How to Run (Docker)
1. Create a root `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Update `.env` with your real MongoDB Atlas connection URI:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/washflow?retryWrites=true&w=majority
   ```
3. Launch all services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Swagger UI URLs
- Gateway: `http://localhost:8081/swagger-ui.html` (Placeholder)
- User Auth Service: `http://localhost:8082/swagger-ui.html` (Placeholder)
- Laundry Service: `http://localhost:8083/swagger-ui.html` (Placeholder)
- Order & Pickup Service: `http://localhost:8084/swagger-ui.html` (Placeholder)

## API Key Header Format
- Header Key: `X-API-KEY` (Placeholder)
- Header Value: `<your-api-key>` (Placeholder)