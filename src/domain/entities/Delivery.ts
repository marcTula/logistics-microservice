// src/domain/entities/Delivery.ts
export type DeliveryStatusCode = 'CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';

export interface DeliveryStatus {
  code: DeliveryStatusCode;
  description?: string;
  updatedAt: Date;
}

export class Delivery {
  constructor(
    public readonly deliveryId: string,
    public readonly orderId: string,
    public readonly address: {
      name: string;
      street: string;
      city: string;
      postalCode: string;
      country: string;
    },
    public readonly items: { sku: string; qty: number }[],
    public readonly provider: 'TLS' | 'NRW',

    public providerShipmentId: string,
    public label: { format: 'PDF' | 'PNG'; contentBase64: string },

    public status: DeliveryStatus,
    public history: { code: DeliveryStatusCode; at: Date; description?: string }[] = [],
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  updateStatus(newStatus: Omit<DeliveryStatus, 'updatedAt'>) {
    const now = new Date();
    this.status = { ...newStatus, updatedAt: now };
    this.updatedAt = now;
    this.history.push({ code: newStatus.code, at: now, description: newStatus.description });
  }

  static created(params: {
    deliveryId: string;
    orderId: string;
    address: Delivery['address'];
    items: Delivery['items'];
    provider: Delivery['provider'];
    providerShipmentId: string;
    label: Delivery['label'];
  }) {
    const now = new Date();
    return new Delivery(
      params.deliveryId,
      params.orderId,
      params.address,
      params.items,
      params.provider,
      params.providerShipmentId,
      params.label,
      { code: 'CREATED', updatedAt: now },
      [{ code: 'CREATED', at: now, description: 'Created' }],
      now,
      now
    );
  }
}
