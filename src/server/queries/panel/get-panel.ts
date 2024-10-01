import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getPanel(supabase: Client, id: string) {
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('panel')
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
    ['panel', id],
    {
      tags: [`panel_${id}`]
    }
  )();
}
