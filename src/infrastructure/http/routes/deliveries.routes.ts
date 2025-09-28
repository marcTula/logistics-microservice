import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { createDeliveryBody, createDeliveryResponse201, getStatusResponse200 } from '../schemas/deliveries.schemas';
import { makeDeliveriesController } from '../controllers/deliveries.controller';

export default fp(async function deliveriesRoutes(app: FastifyInstance, opts: any) {
  const ctrl = makeDeliveriesController(opts.deps); // inyectas casos de uso desde server

  app.post('/deliveries', {
    schema: {
      summary: 'Create delivery and return label',
      tags: ['Deliveries'],
      body: createDeliveryBody,
      response: { 201: createDeliveryResponse201, 400: { type:'object', properties:{ error:{ type:'string'} } } }
    }
  }, ctrl.create);

  app.get('/deliveries/:id/status', {
    schema: {
      summary: 'Get latest status for a delivery',
      tags: ['Deliveries'],
      params: { type: 'object', required: ['id'], properties: { id: { type:'string' } } },
      response: { 200: getStatusResponse200, 404: { type:'object', properties:{ error:{ type:'string'} } } }
    }
  }, ctrl.getStatus);
});
