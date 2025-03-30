'use client';

import { User } from '@supabase/supabase-js';
import { ArrowDownUp, Columns2, File, Home } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { NavSection } from '@/components/sidebar/nav-section';
import { NavUser } from '@/components/sidebar/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

const items = {
  platform: [
    {
      title: 'Dashboard',
      href: '/',
      icon: Home
    },
    {
      title: 'Gerar Modelo',
      href: '/generate-model',
      icon: File
    }
  ],
  registers: [
    {
      title: 'Inversores',
      href: '/inverters',
      icon: ArrowDownUp
    },
    {
      title: 'Painéis',
      href: '/panels',
      icon: Columns2
    }
  ]
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User | null;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center py-6">
        <Link href="/">
          <img src="/topsun.png" alt="logo" width={100} height={28.56} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavSection title="Plataforma" items={items.platform} />
        <NavSection title="Registros" items={items.registers} />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div>Loading...</div>}>
          <NavUser user={user} />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
