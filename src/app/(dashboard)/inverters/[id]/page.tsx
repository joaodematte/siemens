import { Metadata } from 'next';

import { EditInverterForm } from '@/components/forms/inverters/edit';
import { getInverter } from '@/server/queries/inverter/get-inverter';
import { getManufacturers } from '@/server/queries/manufacturers/get-manufacturers';
import { createClient } from '@/server/supabase/server';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Editar Inversor'
};

export default async function EditInverterPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const [manufacturers, inverter] = await Promise.all([getManufacturers(supabase), getInverter(supabase, id)]);

  return <EditInverterForm manufacturers={manufacturers ?? []} inverter={inverter ?? null} />;
}
