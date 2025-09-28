import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { startMongoTest, stopMongoTest } from '../setup/mongoMemory';
import { getDb } from '../../src/infrastructure/db/mongoClient';
import { MongoDeliveryRepository } from '../../src/infrastructure/db/MongoDeliveryRepository';
import { Delivery } from '../../src/domain/entities/Delivery';

describe('MongoDeliveryRepository', () => {
  let repo: MongoDeliveryRepository;

  beforeAll(async () => {
    await startMongoTest();
    const db = getDb();
    repo = new MongoDeliveryRepository(db);
  });

  afterAll(async () => {
    await stopMongoTest();
  });

  it('guarda, lee y actualiza estado', async () => {
    const delivery = Delivery.created({
      deliveryId: 'd1',
      orderId: 'ORD-1',
      address: {
        name: 'Ada',
        street: 'Baker 221B',
        city: 'London',
        postalCode: 'NW1',
        country: 'GB',
      },
      items: [{ sku: 'SKU1', qty: 1 }],
      provider: 'TLS',
      providerShipmentId: 'tls_1',
      label: { format: 'PDF', contentBase64: 'bGFiZWw=' },
    });

    await repo.save(delivery);

    const found = await repo.findById('d1');
    expect(found).not.toBeNull();
    expect(found?.provider).toBe('TLS');
    expect(found?.orderId).toBe('ORD-1');
    expect(found?.status.code).toBe('CREATED');

    await repo.updateStatus('d1', {
      code: 'IN_TRANSIT',
      description: 'go',
      updatedAt: new Date(),
    });

    const found2 = await repo.findById('d1');
    expect(found2?.status.code).toBe('IN_TRANSIT');
    expect(found2?.history.length).toBe(2);
  });
});
