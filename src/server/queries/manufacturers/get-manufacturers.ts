import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getManufacturers(supabase: Client) {
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('manufacturer')
        .select('*')
        .order('name', { ascending: true })
        .throwOnError();

      return data;
    },
    ['manufacturers'],
    {
      tags: ['manufacturers']
    }
  )();
}
