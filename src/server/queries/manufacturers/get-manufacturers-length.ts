import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getManufacturersLength(supabase: Client) {
  return unstable_cache(
    async () => {
      const { count } = await supabase.from('manufacturer').select('*', { count: 'exact', head: true }).throwOnError();

      return count ?? 0;
    },
    ['manufacturers_length'],
    {
      tags: ['manufacturers_length']
    }
  )();
}
