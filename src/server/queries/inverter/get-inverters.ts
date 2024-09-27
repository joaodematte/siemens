import { Client } from '@/server/supabase/types';

export async function getInverters(supabase: Client) {
  const { data } = await supabase.from('inverter').select('*').throwOnError();

  return data;
}
