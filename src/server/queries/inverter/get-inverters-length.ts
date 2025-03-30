import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getInvertersLength(supabase: Client) {
  return unstable_cache(
    async () => {
      const { count } = await supabase.from('inverter').select('*', { count: 'exact', head: true }).throwOnError();

      return count ?? 0;
    },
    ['inverters_length'],
    {
      tags: ['inverters_length']
    }
  )();
}
