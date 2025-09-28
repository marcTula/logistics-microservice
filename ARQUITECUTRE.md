Diagrama arquitectura:

                 ┌──────────── HTTP (Fastify, Swagger) ────────────┐
                 │          Controllers / Routes / Schemas          │
                 └───────────────┬───────────────────┬──────────────┘
                                 │                   │
                      (Ports)    │                   │    (Ports)
             ┌───────────────────▼───┐           ┌───▼───────────────────┐
             │  Application (UCs)    │           │       Domain           │
             │  - CreateDelivery     │           │  Entidades/Value Obj   │
             │  - GetDeliveryStatus  │           │  Puertos (interfaces)  │
             │  - ProcessWebhook     │           └─────────────────────────┘
             │  - UpdateFromPolling  │
             └───────────▲───────────┘
                         │
          ┌──────────────┴──────────────┐
          │         Infrastructure       │
          │  - Mongo Repository          │
          │  - TLS/NRW Provider Adapters │
          │  - Cron (node-cron)          │
          └──────────────────────────────┘


Estructura proyecto:

src/
  application/
    dto/                # Zod DTOs
    use-cases/          # Casos de uso
  domain/
    ports/              # Interfaces (repos/proveedores)
  infrastructure/
    db/                 # Mongo client + repos
    http/
      controllers/      # Controladores
      routes/           # rutas (Fastify)
      schemas/          # JSON Schemas para rutas
      server.ts         # Fastify + Swagger
    providers/
      mocks/            # TLS/NRW mock servers
      *.Adapter.ts      # Adaptadores HTTP 
    scheduling/         # Cron de polling NRW
  bootstrap/
    index.ts            # Arranque: DI + server

