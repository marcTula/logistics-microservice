import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startMongoTest, stopMongoTest } from '../setup/mongoMemory';
import { getDb } from '../../src/infrastructure/db/mongoClient';
import { MongoDeliveryRepository } from '../../src/infrastructure/db/MongoDeliveryRepository';
import { buildServer } from '../../src/infrastructure/http/server';
import { ProcessWebhookStatus } from '../../src/application/use-cases/ProcessWebhookStatus';

describe('Webhooks TLS', () => {
  let app: any, repo: MongoDeliveryRepository;

  beforeAll(async () => {
    await startMongoTest();
    repo = new MongoDeliveryRepository(getDb());
    app = await buildServer({ processWebhookStatus: new ProcessWebhookStatus(repo) });
  });
  afterAll(stopMongoTest);

  it('204 cuando actualiza un envío existente', async () => {
    await repo.save({
      deliveryId: 'd1', order: {}, provider: 'TLS', providerShipmentId: 'tls_1',
      label: { format: 'PDF', contentBase64: 'x' },
      status: { code: 'CREATED', updatedAt: new Date() },
      history: [{ code: 'CREATED', at: new Date() }],
      createdAt: new Date(), updatedAt: new Date()
    } as any);

    const res = await app.inject({
      method: 'POST', url: '/webhooks/tls',
      payload: { shipmentId: 'tls_1', status: { code: 'IN_TRANSIT' } }
    });
    expect(res.statusCode).toBe(204);
  });

  it('404 cuando no encuentra el envío', async () => {
    const res = await app.inject({
      method: 'POST', url: '/webhooks/tls',
      payload: { shipmentId: 'nope', status: { code: 'FAILED' } }
    });
    expect(res.statusCode).toBe(404);
  });
});
