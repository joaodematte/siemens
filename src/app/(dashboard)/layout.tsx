import { Breadcrumb } from '@/components/breadcrumb';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { createClient } from '@/server/supabase/server';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="grow">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb />
            </div>
          </header>
          <div className="px-4">{children}</div>
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
