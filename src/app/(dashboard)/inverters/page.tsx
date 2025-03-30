import { Metadata } from 'next';

import InvertersTable from '@/components/tables/inverters-table';
import { getInverters } from '@/server/queries/inverter/get-inverters';
import { createClient } from '@/server/supabase/server';

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Inversores'
};

export default async function InverterPage() {
  const supabase = await createClient();

  const inverters = await getInverters(supabase);

  return <InvertersTable inverters={inverters ?? []} />;
}
