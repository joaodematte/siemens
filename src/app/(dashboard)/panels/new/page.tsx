import { NewPanelForm } from '@/components/forms/panels/new';
import { getManufacturers } from '@/server/queries/manufacturers/get-manufacturers';
import { createClient } from '@/server/supabase/server';

export default async function NewPanelPage() {
  const supabase = createClient();

  const manufacturers = await getManufacturers(supabase);

  return <NewPanelForm manufacturers={manufacturers ?? []} />;
}
