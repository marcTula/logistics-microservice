export const tlsWebhookBodySchema = {
  type: 'object',
  required: ['shipmentId', 'status'],
  properties: {
    shipmentId: { type: 'string' },
    status: {
      type: 'object',
      required: ['code'],
      properties: {
        code: { type: 'string', enum: ['CREATED', 'IN_TRANSIT', 'DELIVERED', 'FAILED'] },
        at: { type: 'string', format: 'date-time' },
        description: { type: 'string' }
      }
    }
  }
} as const;

export const tlsWebhookResponse204 = { description: 'No Content' } as const;

export const tlsWebhookResponse404 = {
  type: 'object',
  properties: { error: { type: 'string' } }
} as const;
