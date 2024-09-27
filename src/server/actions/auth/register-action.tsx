'use server';

import { revalidatePath } from 'next/cache';

import { actionClient } from '@/server/actions/safe-action';
import { registerSchema } from '@/server/schemas/auth/register-schema';
import authErrorsCodes from '@/server/supabase/errors';

export const registerAction = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { email, password, name, lastName } = parsedInput;

    const { error } = await ctx.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: `${name} ${lastName}`,
          first_name: name,
          last_name: lastName
        }
      }
    });

    if (error && error.code && error.code in authErrorsCodes) {
      throw new Error(
        authErrorsCodes[error.code as keyof typeof authErrorsCodes]
      );
    }

    revalidatePath('/', 'layout');
  });
