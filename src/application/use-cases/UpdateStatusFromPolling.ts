import type { IDeliveryRepository } from '../../domain/ports/IDeliveryRepository';
import type { ILabelProvider } from '../../domain/ports/ILabelProvider';

export class UpdateStatusFromPolling {
  constructor(
    private repo: IDeliveryRepository,
    private nrwProvider: ILabelProvider
  ) {}

  async exec(activeShipment: { deliveryId: string; providerShipmentId: string }) {
    if (!this.nrwProvider.getLatestStatus) return;
    const status = await this.nrwProvider.getLatestStatus(activeShipment.providerShipmentId);
    await this.repo.updateStatus(activeShipment.deliveryId, {
      code: status.code as any,
      updatedAt: status.at,
      description: status.description
    });
  }
}
