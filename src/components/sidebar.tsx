'use client';

import { ArrowDownUp, Columns2, File, House } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type SidebarItem =
  | {
      id: number;
      type: 'button';
      name: string;
      icon: React.ReactNode;
      href: string;
    }
  | {
      id: number;
      type: 'separator';
    };

const sidebarItems: SidebarItem[] = [
  {
    id: 0,
    type: 'button',
    name: 'Dashboard',
    icon: <House size={18} strokeWidth={2.5} />,
    href: '/'
  },
  {
    id: 1,
    type: 'button',
    name: 'Gerar Diagrama',
    icon: <File size={18} strokeWidth={2.5} />,
    href: '/generate'
  },
  {
    id: 2,
    type: 'separator'
  },
  {
    id: 3,
    type: 'button',
    name: 'Inversores',
    icon: <ArrowDownUp size={18} strokeWidth={2.5} />,
    href: '/inverters'
  },
  {
    id: 4,
    type: 'button',
    name: 'Painéis',
    icon: <Columns2 size={18} strokeWidth={2.5} />,
    href: '/panels'
  }
];

function SidebarItem({ item }: { item: (typeof sidebarItems)[number] }) {
  const pathname = usePathname();

  if (item.type === 'separator') {
    return <Separator className="my-4" />;
  }

  const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));

  return (
    <Link
      href={item.href}
      className={cn(
        'text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-primary focus-visible:ring-offset-background flex w-full items-center gap-4 rounded-md px-4 py-2 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
        active && 'bg-accent text-foreground'
      )}
    >
      {item.icon}
      {item.name}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-full max-w-64 border-r lg:block">
      <div className="flex items-start justify-center py-6">
        <Link href="/">
          <img src="/topsun.png" alt="logo" width={100} height={28.56} />
        </Link>
      </div>
      <div className="flex flex-col gap-1 p-6">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </div>
    </aside>
  );
}
