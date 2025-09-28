import type { ILabelProvider, ProviderStatus } from '../../domain/ports/ILabelProvider';

export class NRWProviderAdapter implements ILabelProvider {
  name: 'NRW' | 'TLS' = 'NRW';
  constructor(private baseUrl: string) {}

  async createLabel(input: any) {
    const res = await fetch(`${this.baseUrl}/shipments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error(`NRW createLabel failed: ${res.status}`);
    const json = await res.json() as any;
    return { shipmentId: json.shipmentId, label: json.label };
  }

  async getLatestStatus(shipmentId: string): Promise<ProviderStatus> {
    const res = await fetch(`${this.baseUrl}/shipments/${shipmentId}/status`);
    if (!res.ok) throw new Error(`NRW getLatestStatus failed: ${res.status}`);
    const json = await res.json() as any;
    return {
      shipmentId: json.shipmentId,
      code: json.status.code,
      description: json.status.description,
      at: new Date(json.status.at)
    };
  }
}
