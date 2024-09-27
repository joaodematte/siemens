import { Client } from '@/server/supabase/types';

export function getInverter(supabase: Client) {
  return supabase.from('inverter').select('*');
}
