import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getInverter(supabase: Client, id: string) {
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
        .eq('id', id)
        .single()
        .throwOnError();

      return data;
    },
    ['inverter', id],
    {
      tags: [`inverter_${id}`]
    }
  )();
}
