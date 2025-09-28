import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ProcessWebhookStatus } from '@/application/use-cases/ProcessWebhookStatus';

export function makeWebhooksController(deps: { processWebhookStatus: ProcessWebhookStatus }) {
  return {
    tlsWebhook: async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await deps.processWebhookStatus.exec(req.body as any);
        return reply.code(204).send();
      } catch {
        return reply.code(404).send({ error: 'Delivery not found for shipment' });
      }
    }
  };
}
