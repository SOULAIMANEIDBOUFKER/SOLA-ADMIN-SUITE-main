/**
 * StatusBadge - Displays ticket status with appropriate colors
 */

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { TicketStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusStyles: Record<TicketStatus, string> = {
  open: 'bg-info/10 text-info border-info/20 hover:bg-info/20',
  in_progress: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  closed: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { t } = useTranslation();

  return (
    <Badge
      variant="outline"
      className={cn(statusStyles[status], className)}
    >
      {t(`ticketStatus.${status}`)}
    </Badge>
  );
};
