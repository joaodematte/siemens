import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(3, {
      message: 'Nome precisa ter no mínimo 3 caracteres.'
    }),
    lastName: z.string().min(3, {
      message: 'Sobrenome precisa ter no mínimo 3 caracteres.'
    }),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, {
      message: 'Senha precisa ter no mínimo 8 caracteres.'
    }),
    confirmPassword: z.string().min(8, {
      message: 'Senha precisa ter no mínimo 8 caracteres.'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword']
  })
  .refine((data) => data.email.includes('@topsun.com.br'), {
    message: 'Email precisa terminar com @topsun.com.br',
    path: ['email']
  });
