/**
 * Topbar - Header bar with breadcrumbs and actions
 */

import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">{t('nav.menu')}</span>
      </Button>

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Right side actions can be added here */}
      <div className="ml-auto flex items-center gap-2">
        {/* Placeholder for notifications, search, etc. */}
      </div>
    </header>
  );
};
