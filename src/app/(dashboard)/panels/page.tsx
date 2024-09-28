import { Metadata } from 'next';

import PanelsTable from '@/components/tables/panels-tabe';
import { getPanels } from '@/server/queries/panel/get-panels';
import { createClient } from '@/server/supabase/server';

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Painéis'
};

export default async function PanelsPage() {
  const supabase = createClient();

  const panels = await getPanels(supabase);

  console.log(panels);

  return <PanelsTable panels={panels ?? []} />;
}
