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
  const supabase = createClient();

  const session = await supabase.auth.getUser();

  if (!session.data.user) {
    return null;
  }

  const displayName: string = session.data.user.user_metadata.display_name;
  const nameArray = displayName.split(' ');
  const fallbackName = `${nameArray[0][0].toUpperCase()}${nameArray[1][0].toUpperCase()}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 py-8">
          <span className="sr-only">Toggle user menu</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background">
            {fallbackName}
          </div>
          <div className="hidden flex-col items-start md:flex">
            <p className="font-bold">{displayName}</p>
            <p className="text-sm text-muted-foreground">
              {session.data.user.email}
            </p>
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
