import { describe, it, expect, vi } from 'vitest';
import { UpdateStatusFromPolling } from '../../src/application/use-cases/UpdateStatusFromPolling';

describe('UpdateStatusFromPolling', () => {
  it('actualiza estado usando getLatestStatus del proveedor NRW', async () => {
    const repo = { updateStatus: vi.fn(async () => {}) } as any;
    const nrw = {
      getLatestStatus: vi.fn(async (id: string) => ({
        shipmentId: id,
        code: 'IN_TRANSIT',
        at: new Date(),
        description: 'ok',
      })),
    } as any;

    const uc = new UpdateStatusFromPolling(repo, nrw);
    await uc.exec({ deliveryId: 'd1', providerShipmentId: 'nrw_1' });

    expect(nrw.getLatestStatus).toHaveBeenCalledWith('nrw_1');
    expect(repo.updateStatus).toHaveBeenCalled();
  });
});
