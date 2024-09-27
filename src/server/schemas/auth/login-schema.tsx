import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Senha deve ter pelo menos 8 caracteres.'
  })
});
