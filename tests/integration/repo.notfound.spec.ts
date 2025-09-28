import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startMongoTest, stopMongoTest } from '../setup/mongoMemory';
import { getDb } from '../../src/infrastructure/db/mongoClient';
import { MongoDeliveryRepository } from '../../src/infrastructure/db/MongoDeliveryRepository';

describe('MongoDeliveryRepository not found', () => {
  let repo: MongoDeliveryRepository;
  beforeAll(async () => { await startMongoTest(); repo = new MongoDeliveryRepository(getDb()); });
  afterAll(stopMongoTest);

  it('lanza error si no existe al actualizar', async () => {
    await expect(repo.updateStatus('unknown', { code: 'FAILED', updatedAt: new Date() } as any))
      .rejects.toThrow(/Delivery not found/);
  });
});
