import { Client } from '@/server/supabase/types';

export async function getPanels(supabase: Client) {
  const { data } = await supabase.from('panel').select('*').throwOnError();

  return data;
}
