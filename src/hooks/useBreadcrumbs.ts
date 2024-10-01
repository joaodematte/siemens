import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface BreadcrumbConfig {
  [key: string]: { label: string; href: string | ((id: string) => string) };
}

export const breadcrumbConfig: BreadcrumbConfig = {
  '/': { label: 'Dashboard', href: '/' },
  '/generate': { label: 'Gerar Diagrama', href: '/generate' },
  '/inverters': { label: 'Inversores', href: '/inverters' },
  '/inverters/new': { label: 'Novo', href: '/inverters/new' },
  '/inverters/[id]': {
    label: 'Editar',
    href: (id: string) => `/inverters/${id}`
  },
  '/panels': { label: 'Painéis', href: '/panels' },
  '/panels/new': { label: 'Novo', href: '/panels/new' },
  '/panels/[id]': {
    label: 'Editar',
    href: (id: string) => `/panels/${id}`
  },
  '/settings': { label: 'Configurações', href: '/settings' }
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  return useMemo(() => {
    // Handle root path explicitly
    if (pathname === '/') {
      return [breadcrumbConfig['/']];
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    let currentPath = '';

    for (const segment of pathSegments) {
      currentPath += `/${segment}`;

      const configKey = Object.keys(breadcrumbConfig).find((key) => {
        const pattern = new RegExp(`^${key.replace(/\[.*?\]/g, '[^/]+')}$`);

        return pattern.test(currentPath);
      });

      if (configKey) {
        const item = breadcrumbConfig[configKey];

        breadcrumbs.push({
          label: item.label,
          href: typeof item.href === 'function' ? item.href(segment) : item.href
        });
      }
    }

    return breadcrumbs;
  }, [pathname]);
}
