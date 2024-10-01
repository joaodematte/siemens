import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getInverters(supabase: Client) {
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('inverter')
        .select(
          `
        *,
        manufacturer:manufacturer_id (
          id,
          name
        ),
        profile:created_by (
          id,
          first_name,
          last_name
        )
      `
        )
        .throwOnError();

      return data;
    },
    ['inverters'],
    {
      tags: ['inverters']
    }
  )();
}
