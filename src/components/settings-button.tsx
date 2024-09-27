'use client';

import { useRouter } from 'next/navigation';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function SettingsButton() {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={() => {
        router.push('/dashboard/settings');
      }}
    >
      Configurações
    </DropdownMenuItem>
  );
}
