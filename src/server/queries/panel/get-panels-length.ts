import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getPanelsLength(supabase: Client) {
  return unstable_cache(
    async () => {
      const { count } = await supabase.from('panel').select('*', { count: 'exact', head: true }).throwOnError();

      return count ?? 0;
    },
    ['panels_length'],
    {
      tags: ['panels_length']
    }
  )();
}
