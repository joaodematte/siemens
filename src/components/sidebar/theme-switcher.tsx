'use client';

import { Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <DropdownMenuItem onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      <Moon /> Tema escuro
      <Switch className="absolute right-2" checked={isDark} />
    </DropdownMenuItem>
  );
}
