import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getSingleLineDiagrams(supabase: Client) {
  return unstable_cache(
    async () => {
      const { data } = await supabase
        .from('single_line_diagram')
        .select('*')
        .throwOnError();

      return data;
    },
    ['single-line-diagram'],
    { tags: ['single-line-diagram'] }
  )();
}
