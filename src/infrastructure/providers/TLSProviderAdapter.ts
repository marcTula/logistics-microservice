import type { ILabelProvider } from '../../domain/ports/ILabelProvider';

export class TLSProviderAdapter implements ILabelProvider {
  name: 'NRW' | 'TLS' = 'TLS';
  constructor(private baseUrl: string) {}

  async createLabel(input: any) {
    const res = await fetch(`${this.baseUrl}/shipments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error(`TLS createLabel failed: ${res.status}`);
    const json = await res.json() as any;
    return { shipmentId: json.shipmentId, label: json.label };
  }
}
