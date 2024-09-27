import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE
} from 'next-safe-action';

import { createClient } from '@/server/supabase/server';

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  }
}).use(async ({ next }) => {
  const supabase = createClient();

  return next({
    ctx: {
      supabase
    }
  });
});

export const authActionClient = actionClient.use(async ({ next, ctx }) => {
  const user = await ctx.supabase.auth.getUser();

  if (!user.data) {
    throw new Error('Unauthorized');
  }

  return next({
    ctx: {
      supabase: ctx.supabase,
      user: user.data
    }
  });
});
