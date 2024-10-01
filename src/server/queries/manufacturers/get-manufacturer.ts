import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getManufacturer(supabase: Client, id: string) {
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('manufacturer')
        .select('*')
        .eq('id', id)
        .throwOnError();

      return data;
    },
    ['manufacturer', id],
    {
      tags: [`manufacturer_${id}`]
    }
  )();
}
