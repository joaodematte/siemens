import { z } from 'zod';

export const createSchema = z.object({
  model: z.string().min(1, {
    message: 'Campo obrigatório'
  }),
  power: z.array(z.number()).min(1, {
    message: 'Campo obrigatório'
  }),
  manufacturer: z.string().min(1, {
    message: 'Campo obrigatório'
  })
});

export const updateSchema = z.object({
  id: z.string().min(1, {
    message: 'Campo obrigatório'
  }),
  model: z.string().min(1, {
    message: 'Campo obrigatório'
  }),
  power: z.array(z.number()).min(1, {
    message: 'Campo obrigatório'
  }),
  manufacturer: z.string().min(1, {
    message: 'Campo obrigatório'
  })
});

export const deleteSchema = z.object({
  id: z.string().min(1, {
    message: 'Campo obrigatório'
  })
});
