import { Client } from '@/server/supabase/types';

export async function getManufacturers(supabase: Client) {
  const { data } = await supabase
    .from('manufacturer')
    .select('*')
    .throwOnError();

  return data;
}
