import { z } from 'zod';

export const createSchema = z.object({
  company: z.enum(['celesc', 'dcelt']),
  consumerUnit: z.string().min(1),
  circuitBreakerCapacity: z.string().min(1),
  connectionType: z.enum(['single', 'two', 'three']),
  panelsAmount: z.string().min(1),
  panelModel: z.string().min(1),
  panelPower: z.string().min(1),
  inverterModel: z.string().min(1)
});
