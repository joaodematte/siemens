'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function SignOutButton() {
  const handleSignOut = async () => {
    console.log('sign out');
  };

  return <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>;
}
