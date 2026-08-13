# 🌊 WashFlow — Microservices Laundry Platform

WashFlow is a modern, enterprise-grade Service-Oriented (SOC) laundry pickup, delivery, and catalog platform. The system is designed as a set of autonomous microservices coordinated through an API Gateway, backed by a MongoDB Atlas cluster, and paired with a high-fidelity glassmorphic React client.

---

## 🏛️ System Architecture

Clients communicate only with the API Gateway. The Gateway handles JWT validation, routing, and internal request signing before forwarding requests to the downstream services inside the private Docker bridge network.

```mermaid
graph TD
    Client[React Client: 5173] -->|API Calls / JWT| Gateway[API Gateway: 8080]
    
    subgraph Private Docker Network
        Gateway -->|Route /auth & /users| AuthSvc[User Auth Service: 8081]
        Gateway -->|Route /services| LaundrySvc[Laundry Service: 8082]
        Gateway -->|Route /orders| OrderSvc[Order Pickup Service: 8083]
    end
    
    subgraph Cloud Database
        AuthSvc -->|Database: washflow_users| Atlas[(MongoDB Atlas Cloud)]
        LaundrySvc -->|Database: washflow_catalog| Atlas
        OrderSvc -->|Database: washflow_orders| Atlas
    end
```

---

## 📋 Microservices Registry

| Service | Port | Database (Atlas) | Description |
| :--- | :---: | :--- | :--- |
| **API Gateway** | `8080` | None | Access point, JWT validation, rate limiting, and request forwarding. |
| **User & Auth Service** | `8081` | `washflow_users` | Handles registration, authentication, and user profiles. |
| **Laundry Service** | `8082` | `washflow_catalog` | Manages laundry services catalog, pricing, and timing. |
| **Order & Pickup Service** | `8083` | `washflow_orders` | Handles order creation, lifecycle transitions, and pickup locations. |
| **React Client** | `5173` | Local Storage | Sleek, edge-to-edge true black glassmorphic React + Vite user interface. |

---

## ⚙️ Environment Setup

1. Copy the template file to create your active environment file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and populate it with your credentials:
   ```env
   # --- MongoDB Atlas URI ---
   MONGODB_URI_USER_AUTH=mongodb+srv://buddhika:tTafUEkZ84qyRK85@cluster0.ysbgvyo.mongodb.net/washflow_users?appName=Cluster0
   MONGODB_URI_LAUNDRY=mongodb+srv://buddhika:tTafUEkZ84qyRK85@cluster0.ysbgvyo.mongodb.net/washflow_catalog?appName=Cluster0
   MONGODB_URI_ORDER_PICKUP=mongodb+srv://buddhika:tTafUEkZ84qyRK85@cluster0.ysbgvyo.mongodb.net/washflow_orders?appName=Cluster0

   # --- Gateway Security Keys ---
   JWT_SECRET=washflow-jwt-super-secret-key-2026-washflow-microservices-coursework-dev-secret-key-32bytes
   ```

*Note: The `.env` file contains sensitive cloud credentials and is pre-configured to be ignored by `.gitignore` so that it is never committed.*

---

## 🚀 How to Run (Using Docker Compose)

Make sure you have **Docker Desktop** installed and running on your host machine.

### Start the entire platform:
```bash
docker compose up --build -d
```

This single command:
1. Provisions a private bridge network (`washflow-network`).
2. Builds and starts all three backend Spring Boot microservices.
3. Builds and starts the API Gateway.
4. Builds the React Client production bundle and serves it on an optimized Alpine Nginx server.
5. Verifies container health sequences.

### Check Status:
```bash
docker compose ps
```

### Stop/Tear down:
```bash
docker compose down
```

---

## 📖 Swagger UI Endpoints

Each backend microservice hosts its own OpenAPI/Swagger UI playground directly on its exposed port. You can use this to execute CRUD requests directly.

| Microservice | Swagger UI URL | Required Header Authorization Key |
| :--- | :--- | :--- |
| **User & Auth Service** | [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html) | None (Public Auth Endpoints) |
| **Laundry Service** | [http://localhost:8082/swagger-ui/index.html](http://localhost:8082/swagger-ui/index.html) | `X-API-KEY: washflow-laundry-dev-key-2026` |
| **Order & Pickup Service** | [http://localhost:8083/swagger-ui/index.html](http://localhost:8083/swagger-ui/index.html) | `X-API-KEY: washflow-order-pickup-dev-key-2026` |

### To authorize a service in Swagger:
1. Open the respective Swagger UI link.
2. Click the green **Authorize** button in the top right.
3. Paste the corresponding `X-API-KEY` value in the textbox and click **Authorize**.

---

## 🧪 Terminal Testing

You can run automated end-to-end CRUD verification tests directly from your PowerShell terminal. This script will execute health checks, register users, login, query/update profiles, create services, and walk an order through its 6 lifecycle status stages:

```powershell
powershell -ExecutionPolicy Bypass -File test-crud.ps1
```

For step-by-step copy-paste testing instructions, reference the [test-manual.ps1](file:///d:/soc/washflow-microservices/washflow-microservices/test-manual.ps1) file.

---

## 💻 React Web Application Client

The React application runs at [http://localhost:5173](http://localhost:5173). 

### Key Features:
- **Ultra-Dark True Black Theme**: Clean and sleek user interface (`#000000` base, `#0A0A0A` surfaces) with high-contrast glowing aqua-teal highlights.
- **Top Horizontal Navbar**: Fixed full-width navigation containing interactive menu items, inline active states, user avatar initials display, and responsive collapsible drawers.
- **Modern User Profile Section**: Allows users to dynamically configure their cover banners and profile picture avatars (persisted in `localStorage` per user account).
