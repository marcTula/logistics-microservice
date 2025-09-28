import type { ILabelProvider } from '../../domain/ports/ILabelProvider';

function fakeBase64Label(text: string) {
  return Buffer.from(`LABEL: ${text}`).toString('base64');
}

export class StubTLSProvider implements ILabelProvider {
  name: 'NRW' | 'TLS' = 'TLS';

  async createLabel(input: any) {
    const shipmentId = `tls_${Date.now()}`;
    return {
      shipmentId,
      label: { format: 'PDF' as const, contentBase64: fakeBase64Label(shipmentId) },
    };
  }
}
