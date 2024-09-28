import { Metadata } from 'next';

import { NewInverterForm } from '@/components/forms/inverters/new';
import { getManufacturers } from '@/server/queries/manufacturers/get-manufacturers';
import { createClient } from '@/server/supabase/server';

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Novo Inversor'
};

export default async function NewInverterPage() {
  const supabase = createClient();

  const manufacturers = await getManufacturers(supabase);

  return <NewInverterForm manufacturers={manufacturers ?? []} />;
}
