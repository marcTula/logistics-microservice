import type { Delivery, DeliveryStatus } from '../entities/Delivery';

export interface IDeliveryRepository {
  save(delivery: Delivery): Promise<void>;
  findById(deliveryId: string): Promise<Delivery | null>;
  findByProviderShipmentId(provider: 'NRW' | 'TLS', providerShipmentId: string): Promise<Delivery | null>;
  updateStatus(deliveryId: string, status: DeliveryStatus): Promise<void>;
}
