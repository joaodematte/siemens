import { Suspense } from 'react';

import { Breadcrumb } from '@/components/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { UserMenu } from '@/components/user-menu';

export function Header() {
  return (
    <header className="bg-background sticky top-0 flex items-center gap-4 border-b px-4 py-2 md:px-6">
      <div className="flex w-full items-center justify-between gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <Breadcrumb />

        <Suspense fallback={<Skeleton className="h-9 w-9 rounded-full" />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}
