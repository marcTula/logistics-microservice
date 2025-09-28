import type { ILabelProvider } from '../../domain/ports/ILabelProvider';

export class StubNRWProvider implements ILabelProvider {
  name: 'NRW' | 'TLS' = 'NRW';

  async createLabel(input: any) {
    const shipmentId = `nrw_${Date.now()}`;
    return {
      shipmentId,
      label: { format: 'PDF' as const, contentBase64: Buffer.from(`LABEL:${shipmentId}`).toString('base64') },
    };
  }

  async getLatestStatus(shipmentId: string) {
    return {
      shipmentId,
      code: 'IN_TRANSIT' as const,
      at: new Date(),
      description: 'Stub polling status',
    };
  }
}
