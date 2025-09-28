import type { IDeliveryRepository } from '../../domain/ports/IDeliveryRepository';

export class GetDeliveryStatus {
  constructor(private repo: IDeliveryRepository) {}
  async exec(deliveryId: string) {
    const found = await this.repo.findById(deliveryId);
    if (!found) throw new Error('Delivery not found');
    return { deliveryId, status: found.status, provider: found.provider };
  }
}
