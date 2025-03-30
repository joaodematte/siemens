'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import {
  Breadcrumb as BreadcrumbContainer,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

export function Breadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumbs();

  const lastPath = pathname.split('/').pop() ?? '';

  if (!lastPath && breadcrumbs.length > 1) return null;

  return (
    <BreadcrumbContainer className="hidden lg:block">
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <Fragment key={item.label}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={typeof item.href === 'function' ? item.href(lastPath) : item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
}
