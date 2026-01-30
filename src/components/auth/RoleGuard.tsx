/**
 * RoleGuard - Guards routes based on user role
 * Shows access denied message if user lacks permission
 */

import { useTranslation } from 'react-i18next';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccess, Resource, Action } from '@/lib/rbac';
import { Card, CardContent } from '@/components/ui/card';

interface RoleGuardProps {
  resource: Resource;
  action?: Action;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  resource,
  action = 'view',
  children,
  fallback,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!canAccess(user?.role, resource, action)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="mx-auto max-w-md mt-12">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">{t('auth.accessDenied')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('auth.accessDeniedMessage')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
