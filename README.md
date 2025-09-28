# logistics-microservice

Servicio de entregas con Arquitectura Hexagonal + DDD, Fastify y  MongoDB :
- TLS: estados vía webhook.
- NRW: actualiza estados vía polling (cron).

```bash
# 1) Variables de entorno
cp .env

# 2) mocks (en terminales separadas o con dev:all)
npm run mock:tls
npm run mock:nrw

# 3) App
npm run dev

# 4) Docs (Swagger)
open http://localhost:3000/docs

# 5) Prueba servicio levantado
curl http://localhost:3000/health

# Requisitos

Node.js ≥ 20
MongoDB local o MongoDB Atlas
NPM/Yarn/Pnpm

# Configuración 

#Con Mongo local -> .env:
MONGO_URL=mongodb://localhost:27017
MONGO_DB=logistics
PORT=3000

PROVIDERS_TLS_BASEURL=http://localhost:4010
PROVIDERS_NRW_BASEURL=http://localhost:4020
POLL_CRON=*/1 * * * *   # cada minuto (dev)

#Con MongoDB Atlas -> .env:

MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net
MONGO_DB=logistics
PORT=3000

PROVIDERS_TLS_BASEURL=http://localhost:4010
PROVIDERS_NRW_BASEURL=http://localhost:4020
POLL_CRON=*/1 * * * *

# Arrancar aplicación

# Instalar dependencias
npm i

# Mock servers (en 2 terminales)
npm run mock:tls
npm run mock:nrw

# App
npm run dev

# Swagger
http://localhost:3000/docs

# CURL endpoints pricipales:

GET /health – Healthcheck simple.
POST /deliveries – Crea una entrega y devuelve la etiqueta.
GET /deliveries/:id/status – Obtiene el último estado.
POST /webhooks/tls – Webhook para actualizaciones TLS.

# Health
curl http://localhost:3000/health

# Crear entrega (TLS)
curl -X POST http://localhost:3000/deliveries \
  -H "content-type: application/json" \
  -d '{
    "orderId":"ORD-1001",
    "address":{"name":"Ada","street":"Baker 221B","city":"London","postalCode":"NW1","country":"GB"},
    "items":[{"sku":"SKU1","qty":1}],
    "providerPreferred":"TLS"
  }'

# Estado
curl http://localhost:3000/deliveries/<deliveryId>/status

#TLS (Webhook push)
curl -X POST http://localhost:4010/simulate-webhook \
  -H "content-type: application/json" \
  -d '{
    "appWebhookUrl":"http://localhost:3000/webhooks/tls",
    "shipmentId":"<tls_xxx>",
    "code":"IN_TRANSIT",
    "description":"TLS push update"
  }'

# TESTS y COBERTURA
# Unit + Integration
npm run test

# Cobertura (HTML en coverage/index.html)
npm run coverage





