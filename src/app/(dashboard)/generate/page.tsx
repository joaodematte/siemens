import { Metadata } from 'next';

import { GenerateSingleLineDiagramForm } from '@/components/forms/single-line-diagram/generate-single-line-diagram-form';
import { getInverters } from '@/server/queries/inverter/get-inverters';
import { getPanels } from '@/server/queries/panel/get-panels';
import { createClient } from '@/server/supabase/server';

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Gerar Diagrama'
};

export default async function GeneratePage() {
  const supabase = createClient();

  const [panels, inverters] = await Promise.all([
    getPanels(supabase),
    getInverters(supabase)
  ]);

  return (
    <GenerateSingleLineDiagramForm panels={panels} inverters={inverters} />
  );
}
