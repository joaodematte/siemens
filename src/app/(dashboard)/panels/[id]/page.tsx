import { Metadata } from 'next';

import { EditPanelForm } from '@/components/forms/panels/edit';
import { getManufacturers } from '@/server/queries/manufacturers/get-manufacturers';
import { getPanel } from '@/server/queries/panel/get-panel';
import { createClient } from '@/server/supabase/server';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Editar Inversor'
};

export default async function EditPanelPage({ params }: Props) {
  const supabase = createClient();

  const [manufacturers, panel] = await Promise.all([
    getManufacturers(supabase),
    getPanel(supabase, params.id)
  ]);

  return <EditPanelForm manufacturers={manufacturers ?? []} panel={panel} />;
}
