import type { FastifyRequest, FastifyReply } from 'fastify';
import type { CreateDelivery } from '@/application/use-cases/CreateDelivery';
import type { GetDeliveryStatus } from '@/application/use-cases/GetDeliveryStatus';
import { CreateDeliverySchema } from '@/application/dto/CreateDeliveryDTO';

export function makeDeliveriesController(deps: {
  createDelivery: CreateDelivery;
  getDeliveryStatus: GetDeliveryStatus;
}) {
  return {
    create: async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = CreateDeliverySchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
      const res = await deps.createDelivery.exec(parsed.data);
      return reply.code(201).send(res);
    },
    getStatus: async (req: FastifyRequest, reply: FastifyReply) => {
      const { id } = req.params as any;
      try {
        const res = await deps.getDeliveryStatus.exec(id);
        return reply.send(res);
      } catch {
        return reply.code(404).send({ error: 'Delivery not found' });
      }
    }
  };
}
