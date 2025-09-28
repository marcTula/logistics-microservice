export type DeliveryDoc = {
  _id?: any; 
  deliveryId: string;
  orderId: string;
  address: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: { sku: string; qty: number }[];
  provider: 'TLS' | 'NRW';

  providerShipmentId: string;
  label: { format: 'PDF' | 'PNG'; contentBase64: string };

  status: { code: 'CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED'; description?: string; updatedAt: Date };
  history: { code: 'CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED'; at: Date; description?: string }[];
  createdAt: Date;
  updatedAt: Date;
};
