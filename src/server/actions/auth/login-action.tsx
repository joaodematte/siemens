'use server';

import { revalidatePath } from 'next/cache';

import { actionClient } from '@/server/actions/safe-action';
import { loginSchema } from '@/server/schemas/auth/login-schema';
import authErrorsCodes from '@/server/supabase/errors';

export const loginAction = actionClient.schema(loginSchema).action(async ({ parsedInput, ctx }) => {
  const { email, password } = parsedInput;

  const { error } = await ctx.supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error && error.code && error.code in authErrorsCodes) {
    throw new Error(authErrorsCodes[error.code as keyof typeof authErrorsCodes]);
  }

  revalidatePath('/', 'layout');

  return {
    success: true,
    message: 'Login realizado com sucesso, redirecionando ao dashboard...'
  };
});
