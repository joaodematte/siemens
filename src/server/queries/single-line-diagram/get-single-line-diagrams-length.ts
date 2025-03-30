import { unstable_cache } from 'next/cache';

import { Client } from '@/server/supabase/types';

export async function getSingleLineDiagramsLength(supabase: Client) {
  return unstable_cache(
    async () => {
      const { count } = await supabase
        .from('single_line_diagram')
        .select('*', { count: 'exact', head: true })
        .throwOnError();

      return count ?? 0;
    },
    ['single-line-diagram_length'],
    { tags: ['single-line-diagram_length'] }
  )();
}
