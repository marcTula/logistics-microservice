import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { startMongoTest, stopMongoTest } from '../setup/mongoMemory';
import { getDb } from '../../src/infrastructure/db/mongoClient';
import { MongoDeliveryRepository } from '../../src/infrastructure/db/MongoDeliveryRepository';
import { buildServer } from '../../src/infrastructure/http/server';
import { CreateDelivery } from '../../src/application/use-cases/CreateDelivery';
import { GetDeliveryStatus } from '../../src/application/use-cases/GetDeliveryStatus';

class FakeProvider {
  name = 'TLS' as const;
  async createLabel() {
    return { shipmentId: 'tls_1', label: { format: 'PDF', contentBase64: 'bGFiZWw=' } };
  }
}

describe('HTTP API', () => {
  let app: any;

  beforeAll(async () => {
    await startMongoTest();
    const db = getDb();
    const repo = new MongoDeliveryRepository(db);
    const createDelivery = new CreateDelivery(repo, [new FakeProvider() as any]);
    const getDeliveryStatus = new GetDeliveryStatus(repo);
    app = await buildServer({ createDelivery, getDeliveryStatus });
  });

  afterAll(async () => {
    await stopMongoTest();
  });

  it('POST /deliveries + GET /deliveries/:id/status', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/deliveries',
      payload: {
        orderId: 'ORD-IT',
        address: { name: 'Ada', street: 'Baker', city: 'London', postalCode: 'NW1', country: 'GB' },
        items: [{ sku: 'SKU', qty: 1 }],
        providerPreferred: 'TLS',
      },
    });
    expect(res.statusCode).toBe(201);
    const { deliveryId } = res.json();

    const res2 = await app.inject({ method: 'GET', url: `/deliveries/${deliveryId}/status` });
    expect(res2.statusCode).toBe(200);
    expect(res2.json().status.code).toBe('CREATED');
  });
});
