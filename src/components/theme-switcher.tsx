'use client';

import { useTheme } from 'next-themes';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const label = theme === 'light' ? 'Tema escuro' : ' Tema claro';

  return (
    <DropdownMenuItem
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {label}
    </DropdownMenuItem>
  );
}
