import { Client } from '@/server/supabase/types';

export async function getSingleLineDiagram(supabase: Client) {
  const { data } = await supabase
    .from('single_line_diagram')
    .select('*')
    .throwOnError();

  return data;
}
