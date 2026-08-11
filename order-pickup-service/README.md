# WashFlow - Order & Pickup Service

The **Order & Pickup Service** manages laundry orders, pickup scheduling, status updates, and order deletion for the WashFlow platform.

## Configuration

The service requires the following environment variables:
- `MONGODB_URI`: MongoDB Atlas connection URI (e.g. `mongodb+srv://<username>:<password>@cluster.mongodb.net/washflow_orders`)
- `SERVICE_API_KEY`: Secret API key used for inter-service authentication (default dev key: `washflow-order-pickup-dev-key-2026`)

## API Key Security

All requests to this microservice require a valid `X-API-KEY` header matching `SERVICE_API_KEY`, **except** for the health check endpoint:

- **Header Name**: `X-API-KEY`
- **Exempt Endpoint**: `GET /health` (accessible without an API key)
- **Protected Endpoints**: `/orders/**` (returns HTTP `401 Unauthorized` if header is missing or invalid)

## Documentation & Swagger UI

Interactive OpenAPI 3.0 documentation is available via Swagger UI:
- **Swagger UI**: `http://localhost:8083/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8083/v3/api-docs`

## Docker Containerization

To build and run this microservice as a standalone Docker container:

```bash
# Build Docker image
docker build -t order-pickup-service .

# Run Docker container with environment file
docker run -d -p 8083:8083 --name order-pickup-service --env-file .env order-pickup-service

# View container logs
docker logs -f order-pickup-service

# Stop and remove container
docker stop order-pickup-service
docker rm order-pickup-service
```
