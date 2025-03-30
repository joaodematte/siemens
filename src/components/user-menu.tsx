import { SignOutButton } from '@/components/sign-out-button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/server/supabase/server';

export async function UserMenu() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const displayName: string = user.user_metadata.display_name;
  const nameArray = displayName.split(' ');
  const fallbackName = `${nameArray[0][0].toUpperCase()}${nameArray[1][0].toUpperCase()}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 py-8">
          <span className="sr-only">Toggle user menu</span>
          <div className="bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-full">
            {fallbackName}
          </div>
          <div className="hidden flex-col items-start md:flex">
            <p className="font-bold">{displayName}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeSwitcher />
        <DropdownMenuItem disabled>Configurações</DropdownMenuItem>
        <DropdownMenuItem disabled>Suporte</DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
