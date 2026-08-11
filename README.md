# Project Overview

WashFlow is a microservices-based laundry pickup and delivery platform built as a Service-Oriented Computing coursework project. The system is composed of independently deployable services coordinated through a central API Gateway.

# Architecture Diagram

To be added in a later step

## Authentication Flow

All client authentication is handled via the API Gateway — microservices are never called directly by clients.

1. **Register** — Client sends `POST /auth/register` to the Gateway with `{"name", "email", "password"}`. The Gateway forwards the request to the User & Auth Service, which creates the account and returns the user record.
2. **Obtain a JWT** — Client sends `POST /oauth/token` to the Gateway with `{"email", "password"}`. The Gateway verifies credentials via the User & Auth Service and returns a signed JWT (`accessToken`).
3. **Authenticated Requests** — For all subsequent requests, the client includes the JWT in the `Authorization: Bearer <token>` header.
4. **Gateway Validation** — The Gateway validates the JWT before forwarding any request to a downstream service. Requests with a missing, invalid, or expired token are rejected with `401 Unauthorized` without reaching any service.

# Team Members & Ownership

| Student ID       | Role                    | Owned Components                                  |
|------------------|-------------------------|---------------------------------------------------|
| ITBIN-2313-0043  | Member / Gateway Lead   | User & Authentication Service + API Gateway       |
| ITBIN-2313-0064  | Member                  | Laundry Service                                   |
| *(teammate)*     | *(to be filled)*        | Order & Pickup Service                            |
| *(teammate)*     | *(to be filled)*        | Client Application                                |

# Branching Strategy

To be added in a later step

# Prerequisites

- Docker Desktop (with Docker Compose)
- Node.js 18+ (for the React client)
- A MongoDB Atlas cluster with the connection string available
- A `.env` file in the project root — copy `.env.example` and fill in the values

# How to Run

## User & Auth Service + API Gateway (ITBIN-2313-0043)

These two services work together and are started as a pair.

**Requirements before running:**
- A `.env` file must exist in the project root (copy from `.env.example` and fill in all values).
- A live MongoDB Atlas connection is required — this is **not** a local MongoDB instance. The `MONGODB_URI` in `.env` must point to your Atlas cluster.

**Start both services:**

```bash
docker compose up --build user-auth-service gateway
```

This will:
1. Build the `user-auth-service` image (Spring Boot, port 8081) and start it — it connects to MongoDB Atlas on startup.
2. Build the `gateway` image (Spring Cloud Gateway, port 8080) and start it — it waits for `user-auth-service` to pass its health check before starting.

**Verify the services are running:**

```bash
# Gateway health
curl http://localhost:8080/actuator/health

# User & Auth Service health (direct — for testing only)
curl http://localhost:8081/health
```

**Run all services (when teammates' services are ready):**

```bash
docker compose up --build
```

## Laundry Service (ITBIN-2313-0064)

Manages available laundry service types, pricing, and estimated processing times. Runs on port **8082** (base package `lk.ac.horizoncampus.washflow.laundry`).

**Requirements before running:**
- A `.env` file inside `laundry-service/` (copied from `.env.example`) supplying `MONGODB_URI` and `SERVICE_API_KEY` (or `LAUNDRY_SERVICE_API_KEY`).
- A live MongoDB Atlas connection (database: `washflow_catalog`).

**Option A — Run with Maven Wrapper:**

```powershell
cd laundry-service
$env:MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/washflow_catalog"
$env:SERVICE_API_KEY="washflow-laundry-dev-key-2026"
./mvnw spring-boot:run
```

**Option B — Run with Docker (Standalone):**

```bash
cd laundry-service
docker build -t laundry-service .
docker run -p 8082:8082 --env-file .env laundry-service
```

**Verify the service is running:**

```bash
# Health check — no API key required
curl http://localhost:8082/health
```

**API Key Security:**

All endpoints except `GET /health` require the `X-API-KEY` header (`SERVICE_API_KEY`). Swagger UI endpoints (`/swagger-ui.html`, `/v3/api-docs`) are also exempt.

| Header | Value |
|---|---|
| `X-API-KEY` | Value of `SERVICE_API_KEY` (or `LAUNDRY_SERVICE_API_KEY`) env var |

- **Exempt endpoints:** `GET /health`, `/swagger-ui/**`, `/v3/api-docs/**` — no key required.
- Missing or wrong key returns `401 Unauthorized` with JSON body `{"status":401,"message":"Missing or invalid API key","timestamp":"<ISO-8601>"}`.

**Example — calling Laundry Service directly (bypassing Gateway):**

```bash
curl http://localhost:8082/services \
  -H "X-API-KEY: washflow-laundry-dev-key-2026"
```

## Order & Pickup Service

> *To be added by the Order & Pickup Service owner.*

## React Client

> *To be added by the Client Application owner.*

# API Endpoints Summary

### Laundry Service Endpoints (Port 8082)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Health check endpoint returning service status | None (Public) |
| `GET` | `/services` | List all available laundry services and pricing | `X-API-KEY` |
| `GET` | `/services/{id}` | Retrieve details of a specific laundry service by ID | `X-API-KEY` |
| `POST` | `/services` | Create a new laundry service item | `X-API-KEY` |
| `PUT` | `/services/{id}` | Update an existing laundry service item (partial update) | `X-API-KEY` |
| `DELETE` | `/services/{id}` | Delete a laundry service item by ID | `X-API-KEY` |

# Swagger UI URLs

Swagger UI is available for each microservice when running locally. The Gateway itself does not expose Swagger — use the individual service URLs below.

| Service                  | Swagger UI URL                              |
|--------------------------|---------------------------------------------|
| User & Auth Service      | http://localhost:8081/swagger-ui.html        |
| Laundry Service          | http://localhost:8082/swagger-ui.html        |
| Order & Pickup Service   | *(to be filled by Order & Pickup Service owner)* |

# API Key Header Format

Each microservice enforces direct request protection using its own unique API key. This is a **service-to-service layer**, separate from the JWT authentication layer in the Gateway. Laundry Service enforces this verification via `ApiKeyAuthFilter`.

**Header name:** `X-API-KEY`

**When this matters:** The `X-API-KEY` header is only required when calling a microservice **directly** (e.g., during isolated development or testing at the service level, bypassing the Gateway). Normal client traffic routed through the Gateway at port 8080 does not need to include this header — the Gateway adds it internally when forwarding requests.

**Exempt endpoint:** `GET /health` — no API key required on any service.

### Service-Specific Environment Variable Mapping

| Service                        | Environment Variable            | `application.properties` Key |
|--------------------------------|---------------------------------|-------------------------------|
| User & Auth Service            | `USER_AUTH_SERVICE_API_KEY`     | `service.api-key`             |
| Laundry Service                | `SERVICE_API_KEY`               | `service.api-key`             |
| Order & Pickup Service         | `ORDER_PICKUP_SERVICE_API_KEY`  | *(to be filled)*              |

**Example — testing User & Auth Service directly (bypassing Gateway):**

```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: washflow-user-auth-dev-key-2026" \
  -d '{"email":"jane.doe@washflow.com","password":"password123"}'
```

> **Note:** The `/auth/login` endpoint (port 8081) is for internal Gateway use only. Client applications should always call `POST /oauth/token` on the Gateway (port 8080), which performs credential verification and returns a signed JWT.
