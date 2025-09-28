import type { IDeliveryRepository } from '../../domain/ports/IDeliveryRepository';

export class ProcessWebhookStatus {
  constructor(private repo: IDeliveryRepository) {}

  async exec(payload: { shipmentId: string; status: { code: any; description?: string; at?: string | Date } }) {
    const found = await this.repo.findByProviderShipmentId('TLS', payload.shipmentId);
    if (!found) throw new Error('Delivery not found for webhook');
    await this.repo.updateStatus(found.deliveryId, {
      code: payload.status.code,
      description: payload.status.description,
      updatedAt: payload.status.at ? new Date(payload.status.at) : new Date()
    });
  }
}
