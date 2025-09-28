import { randomUUID } from 'node:crypto';
import type { IDeliveryRepository } from '../../domain/ports/IDeliveryRepository';
import type { ILabelProvider } from '../../domain/ports/ILabelProvider';
import type { CreateDeliveryDTO } from '../dto/CreateDeliveryDTO';
import { Delivery } from '../../domain/entities/Delivery';

export class CreateDelivery {
  constructor(
    private repo: IDeliveryRepository,
    private providers: ILabelProvider[]
  ) {}

  private pickProvider(input: CreateDeliveryDTO): ILabelProvider {
    if (input.providerPreferred) {
      const p = this.providers.find(p => p.name === input.providerPreferred);
      if (p) return p;
    }
    const idx = input.orderId.length % this.providers.length;
    return this.providers[idx];
  }

  async exec(input: CreateDeliveryDTO) {
    const provider = this.pickProvider(input);
    const { shipmentId, label } = await provider.createLabel({
      orderId: input.orderId,
      address: input.address
    } as any);

    const entity = Delivery.created({
      deliveryId: randomUUID(),
      orderId: input.orderId,
      address: input.address,
      items: input.items,
      provider: provider.name,
      providerShipmentId: shipmentId,
      label
    });

    await this.repo.save(entity);
    return { deliveryId: entity.deliveryId, label: entity.label };
  }
}
