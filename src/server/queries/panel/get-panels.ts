import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getPanels(supabase: Client) {
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
        .order('model', { ascending: true })
        .throwOnError();

      return data;
    },
    ['panels'],
    {
      tags: ['panels']
    }
  )();
}
