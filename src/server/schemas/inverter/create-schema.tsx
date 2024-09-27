import { z } from 'zod';

export const createSchema = z.object({
  model: z.string().min(1, {
    message: 'Campo obrigatório'
  }),
  activePower: z.string().min(1, {
    message: 'Campo obrigatório'
  }),
  manufacturer: z.string().min(1, {
    message: 'Campo obrigatório'
  })
});
