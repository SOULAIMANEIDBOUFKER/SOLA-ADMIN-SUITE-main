/**
 * Breadcrumbs - Shows navigation path
 */

import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Build breadcrumb items from path
  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Map path segments to labels
    const pathLabels: Record<string, string> = {
      tickets: t('nav.tickets'),
      users: t('nav.users'),
      settings: t('nav.settings'),
    };

    let currentPath = '';
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === paths.length - 1;

      // Check if segment is an ID (for detail pages)
      const isId = /^[a-zA-Z0-9-]+$/.test(segment) && !pathLabels[segment];

      if (isId) {
        items.push({
          label: t('tickets.ticketDetails'),
        });
      } else {
        items.push({
          label: pathLabels[segment] || segment,
          path: isLast ? undefined : currentPath,
        });
      }
    });

    return items;
  };

  const breadcrumbs = buildBreadcrumbs();

  // Don't show breadcrumbs on dashboard
  if (location.pathname === '/') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Home className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{t('nav.dashboard')}</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link
        to="/"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          {item.path ? (
            <Link
              to={item.path}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn('font-medium', !item.path && 'text-foreground')}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
