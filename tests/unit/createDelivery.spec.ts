import { describe, it, expect, vi } from 'vitest';
import { CreateDelivery } from '../../src/application/use-cases/CreateDelivery';

const repo = {
  save: vi.fn(async () => {}),
  findById: vi.fn(),
  updateStatus: vi.fn(),
} as any;

const tls = {
  name: 'TLS',
  createLabel: vi.fn(async () => ({
    shipmentId: 'tls_1',
    label: { format: 'PDF', contentBase64: 'bGFiZWw=' },
  })),
};

const nrw = {
  name: 'NRW',
  createLabel: vi.fn(async () => ({
    shipmentId: 'nrw_1',
    label: { format: 'PDF', contentBase64: 'bGFiZWw=' },
  })),
};

describe('CreateDelivery', () => {
  it('crea una entrega con proveedor preferido TLS', async () => {
    const uc = new CreateDelivery(repo, [nrw as any, tls as any]);

    const res = await uc.exec({
      orderId: 'ORD-1',
      address: { name: 'Ada', street: 'Baker', city: 'London', postalCode: 'NW1', country: 'GB' },
      items: [{ sku: 'SKU1', qty: 1 }],
      providerPreferred: 'TLS',
    } as any);

    expect(res.deliveryId).toBeDefined();
    expect(res.label.format).toBe('PDF');
    expect(tls.createLabel).toHaveBeenCalledOnce();
    expect(repo.save).toHaveBeenCalledOnce();
  });
});
