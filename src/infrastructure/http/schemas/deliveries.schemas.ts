// Body de POST /deliveries
export const createDeliveryBody = {
  type: 'object',
  required: ['orderId', 'address', 'items'],
  properties: {
    orderId: { type: 'string', minLength: 1 },
    address: {
      type: 'object',
      required: ['name', 'street', 'city', 'postalCode', 'country'],
      properties: {
        name: { type: 'string', minLength: 1 },
        street: { type: 'string', minLength: 1 },
        city: { type: 'string', minLength: 1 },
        postalCode: { type: 'string', minLength: 1 },
        country: { type: 'string', minLength: 2, maxLength: 2, description: 'ISO 3166-1 alpha-2' }
      },
      additionalProperties: false
    },
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['sku', 'qty'],
        properties: {
          sku: { type: 'string', minLength: 1 },
          qty: { type: 'integer', minimum: 1 }
        },
        additionalProperties: false
      }
    },
    providerPreferred: { type: 'string', enum: ['NRW', 'TLS'] }
  },
  additionalProperties: false
} as const;

// Respuesta 201 de POST /deliveries
export const createDeliveryResponse201 = {
  type: 'object',
  required: ['deliveryId', 'label'],
  properties: {
    deliveryId: { type: 'string' },
    label: {
      type: 'object',
      required: ['format', 'contentBase64'],
      properties: {
        format: { type: 'string', enum: ['PDF', 'PNG'] },
        contentBase64: { type: 'string' }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
} as const;

// Respuesta 200 de GET /deliveries/:id/status
export const getStatusResponse200 = {
  type: 'object',
  required: ['deliveryId', 'provider', 'status'],
  properties: {
    deliveryId: { type: 'string' },
    provider: { type: 'string', enum: ['NRW', 'TLS'] },
    status: {
      type: 'object',
      required: ['code', 'updatedAt'],
      properties: {
        code: { type: 'string', enum: ['CREATED', 'IN_TRANSIT', 'DELIVERED', 'FAILED'] },
        updatedAt: { type: 'string', format: 'date-time' },
        description: { type: 'string' }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
} as const;

// Errores comunes
export const badRequest400 = {
  type: 'object',
  required: ['error'],
  properties: { error: { type: 'string' } },
  additionalProperties: false
} as const;

export const notFound404 = {
  type: 'object',
  required: ['error'],
  properties: { error: { type: 'string' } },
  additionalProperties: false
} as const;
