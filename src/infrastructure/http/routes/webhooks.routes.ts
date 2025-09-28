import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { makeWebhooksController } from '../controllers/webhooks.controller.';
import { tlsWebhookBodySchema, tlsWebhookResponse204, tlsWebhookResponse404 } from '../schemas/webhooks.schemas';

export default fp(async function webhooksRoutes(app: FastifyInstance, opts: any) {
  const ctrl = makeWebhooksController(opts.deps);

  app.post('/webhooks/tls', {
    schema: {
      summary: 'TLS webhook to push delivery status',
      tags: ['Webhooks'],
      body: tlsWebhookBodySchema,
      response: {
        204: tlsWebhookResponse204,
        404: tlsWebhookResponse404
      }
    }
  }, ctrl.tlsWebhook);
});
