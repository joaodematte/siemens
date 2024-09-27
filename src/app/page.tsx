import { createClient } from '@/server/supabase/server';

export default async function Home() {
  const supabase = createClient();

  const session = await supabase.auth.getUser();

  return (
    <div>{JSON.stringify(session.data.user?.user_metadata.display_name)}</div>
  );
}
