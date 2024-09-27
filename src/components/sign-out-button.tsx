'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { createClient } from '@/server/supabase/client';

export function SignOutButton() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    router.push('/login');

    toast.success('Logout realizado com sucesso, redirecionando...');
  };

  return <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>;
}
