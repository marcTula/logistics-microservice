import { z } from 'zod';

export const AddressSchema = z.object({
  name: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().length(2),
});

export const CreateDeliverySchema = z.object({
  orderId: z.string().min(1),
  address: AddressSchema,
  items: z.array(z.object({
    sku: z.string(),
    qty: z.number().int().positive(),
  })).min(1),
  providerPreferred: z.enum(['NRW','TLS']).optional(),
});

export type CreateDeliveryDTO = z.infer<typeof CreateDeliverySchema>;
