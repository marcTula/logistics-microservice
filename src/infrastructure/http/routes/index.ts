import type { FastifyInstance } from 'fastify';
import deliveriesRoutes from './deliveries.routes';
import webhooksRoutes from './webhooks.routes';

export async function registerAllRoutes(app: FastifyInstance, deps: any) {
  await app.register(deliveriesRoutes, { deps });
  await app.register(webhooksRoutes, { deps });
}