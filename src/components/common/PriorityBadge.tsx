/**
 * PriorityBadge - Displays ticket priority with appropriate colors
 */

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { TicketPriority } from '@/types';
import { Badge } from '@/components/ui/badge';

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

const priorityStyles: Record<TicketPriority, string> = {
  low: 'bg-muted text-muted-foreground border-border',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const { t } = useTranslation();

  return (
    <Badge
      variant="outline"
      className={cn(priorityStyles[priority], className)}
    >
      {t(`ticketPriority.${priority}`)}
    </Badge>
  );
};
