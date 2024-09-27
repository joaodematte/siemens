import InvertersTable from '@/components/tables/inverters-table';
import { getInverters } from '@/server/queries/inverter/get-inverters';
import { createClient } from '@/server/supabase/server';

export default async function InverterPage() {
  const supabase = createClient();

  const inverters = await getInverters(supabase);

  console.log(inverters);

  return <InvertersTable data={inverters ?? []} />;
}
