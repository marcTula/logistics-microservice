export interface CreateLabelInput { orderId: string; address: any; /* ... */ }
export interface CreateLabelResult { shipmentId: string; label: { format: 'PDF'|'PNG'; contentBase64: string }; }

export interface ProviderStatus {
  shipmentId: string;
  code: 'CREATED'|'IN_TRANSIT'|'DELIVERED'|'FAILED';
  description?: string;
  at: Date;
}

export interface ILabelProvider {
  name: 'NRW' | 'TLS';
  createLabel(input: CreateLabelInput): Promise<CreateLabelResult>;
  getLatestStatus?(shipmentId: string): Promise<ProviderStatus>;
}
