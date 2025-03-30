'use client';

import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

interface NavSectionItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface NavSectionProps {
  title: string;
  items: NavSectionItem[];
}

function NavSectionItem({ title, href, ...item }: NavSectionItem) {
  const pathname = usePathname();

  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  return (
    <SidebarMenuItem key={title}>
      <SidebarMenuButton isActive={isActive} asChild>
        <Link href={href}>
          <item.icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function NavSection({ title, items }: NavSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavSectionItem key={item.href} {...item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
