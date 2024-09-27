import { EditInverterForm } from '@/components/forms/inverters/edit';
import { getInverter } from '@/server/queries/inverter/get-inverter';
import { getManufacturers } from '@/server/queries/manufacturers/get-manufacturers';
import { createClient } from '@/server/supabase/server';

interface Props {
  params: { id: string };
}

export default async function EditInverterPage({ params }: Props) {
  const supabase = createClient();

  const [manufacturers, inverter] = await Promise.all([
    getManufacturers(supabase),
    getInverter(supabase, params.id)
  ]);

  return (
    <EditInverterForm
      manufacturers={manufacturers ?? []}
      inverter={inverter ?? null}
    />
  );
}
