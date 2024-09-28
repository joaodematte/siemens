import { z } from 'zod';

export const createSchema = z.object({
  consumerUnit: z.string(),
  circuitBreakerCapacity: z.string(),
  connectionType: z.enum(['single', 'two', 'three']),
  panelsAmount: z.string(),
  panelModel: z.string(),
  panelPower: z.string(),
  inverterModel: z.string()
});
