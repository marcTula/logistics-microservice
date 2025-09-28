import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { registerAllRoutes } from './routes';


export async function buildServer(deps?: any) {
  const app = Fastify({ logger: true });

  await app.register(swagger, {
    openapi: {
      info: { title: 'Logistics API', version: '1.0.0' }
    }
  });
  await app.register(swaggerUI, {
    routePrefix: '/docs',
  });

  app.get('/health', async () => ({ ok: true }));
  await registerAllRoutes(app, deps);
  return app;
}