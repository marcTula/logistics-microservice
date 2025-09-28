import { Collection, Db } from 'mongodb';
import { Delivery } from '../../domain/entities/Delivery';
import type { IDeliveryRepository } from '../../domain/ports/IDeliveryRepository';
import type { DeliveryDoc } from './schemas/delivery';

function toDoc(e: Delivery): DeliveryDoc {
  return {
    deliveryId: e.deliveryId,
    orderId: e.orderId,
    address: e.address,
    items: e.items,
    provider: e.provider,
    providerShipmentId: e.providerShipmentId,
    label: e.label,
    status: e.status,
    history: e.history,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

function toEntity(d: DeliveryDoc): Delivery {
  return new Delivery(
    d.deliveryId,
    d.orderId,
    d.address,
    d.items,
    d.provider,
    d.providerShipmentId,
    d.label,
    d.status,
    d.history,
    d.createdAt,
    d.updatedAt
  );
}

export class MongoDeliveryRepository implements IDeliveryRepository {
  private col: Collection<DeliveryDoc>;
  constructor(db: Db) {
    this.col = db.collection<DeliveryDoc>('deliveries');
    void this.ensureIndexes();
  }

  async save(delivery: Delivery): Promise<void> {
    const doc = toDoc(delivery);
    await this.col.updateOne(
      { deliveryId: delivery.deliveryId },
      { $set: doc },
      { upsert: true }
    );
  }

  async findById(deliveryId: string): Promise<Delivery | null> {
    const doc = await this.col.findOne({ deliveryId });
    return doc ? toEntity(doc) : null;
  }

  async findByProviderShipmentId(provider: 'NRW' | 'TLS', providerShipmentId: string): Promise<Delivery | null> {
    const doc = await this.col.findOne({ provider, providerShipmentId });
    return doc ? toEntity(doc) : null;
  }

  async updateStatus(deliveryId: string, status: Delivery['status']): Promise<void> {
    const now = new Date();
    const res = await this.col.updateOne(
      { deliveryId },
      {
        $set: { status: { ...status, updatedAt: now }, updatedAt: now },
        $push: { history: { code: status.code, at: now, description: status.description } }
      }
    );
    if (res.matchedCount === 0) throw new Error(`Delivery not found: ${deliveryId}`);
  }

   private async ensureIndexes() {
    await this.col.createIndex({ deliveryId: 1 }, { unique: true, name: 'ux_deliveryId' });
    await this.col.createIndex(
      { provider: 1, providerShipmentId: 1 },
      { unique: true, name: 'ux_provider_shipment' }
    );
    await this.col.createIndex({ 'status.code': 1 }, { name: 'ix_status_code' });
  }
}
