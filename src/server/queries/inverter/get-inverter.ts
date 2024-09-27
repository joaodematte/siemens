import { Client } from '@/server/supabase/types';

export async function getInverter(supabase: Client, id: string) {
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
}
