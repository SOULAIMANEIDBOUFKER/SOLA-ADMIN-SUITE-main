/**
 * Tickets Page
 * List all tickets with search, filters, and pagination
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Ticket as TicketIcon, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccess } from '@/lib/rbac';
import { formatDate } from '@/lib/i18n';
import { getTickets, deleteTicket } from '@/services/ticketsService';
import { TicketFilters, TicketStatus, TicketPriority } from '@/types';
import {
  EmptyState,
  ErrorState,
  StatusBadge,
  PriorityBadge,
  ConfirmDialog,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const TicketsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Filters state
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    page: 1,
    pageSize: 10,
  });

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch tickets
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => getTickets(filters),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success(t('tickets.deleteSuccess'));
      setDeleteId(null);
    },
    onError: () => {
      toast.error(t('errors.generic'));
    },
  });

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as TicketStatus | 'all',
      page: 1,
    }));
  };

  const handlePriorityFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      priority: value as TicketPriority | 'all',
      page: 1,
    }));
  };

  const handleRowClick = (id: string) => {
    navigate(`/tickets/${id}`);
  };

  const canDelete = canAccess(user?.role, 'tickets', 'delete');
  const canCreate = canAccess(user?.role, 'tickets', 'create');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('tickets.title')}
          </h1>
          <p className="text-muted-foreground">{t('tickets.allTickets')}</p>
        </div>
        {canCreate && (
          <Button onClick={() => navigate('/tickets/new')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('tickets.newTicket')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('tickets.search')}
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('tickets.filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('tickets.all')}</SelectItem>
                <SelectItem value="open">{t('ticketStatus.open')}</SelectItem>
                <SelectItem value="in_progress">
                  {t('ticketStatus.in_progress')}
                </SelectItem>
                <SelectItem value="closed">{t('ticketStatus.closed')}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.priority}
              onValueChange={handlePriorityFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('tickets.filterPriority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('tickets.all')}</SelectItem>
                <SelectItem value="low">{t('ticketPriority.low')}</SelectItem>
                <SelectItem value="medium">{t('ticketPriority.medium')}</SelectItem>
                <SelectItem value="high">{t('ticketPriority.high')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <ErrorState message={t('errors.generic')} onRetry={() => refetch()} />
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t('table.showing')} {data?.data.length || 0} {t('table.of')}{' '}
            {data?.total || 0} {t('table.results')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : data && data.data.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">{t('tickets.id')}</TableHead>
                    <TableHead>{t('tickets.ticketTitle')}</TableHead>
                    <TableHead className="w-32">{t('tickets.status')}</TableHead>
                    <TableHead className="w-32">{t('tickets.priority')}</TableHead>
                    <TableHead className="w-40">{t('tickets.assignee')}</TableHead>
                    <TableHead className="w-32">{t('tickets.createdAt')}</TableHead>
                    {canDelete && <TableHead className="w-16" />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(ticket.id)}
                    >
                      <TableCell className="font-mono text-sm">
                        {ticket.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {ticket.title}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        {ticket.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {ticket.assignee.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {ticket.assignee.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {t('tickets.unassigned')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(ticket.createdAt)}
                      </TableCell>
                      {canDelete && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(ticket.id);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={TicketIcon}
              title={t('tickets.noTickets')}
              description={canCreate ? t('tickets.newTicket') : undefined}
              action={
                canCreate
                  ? {
                      label: t('tickets.newTicket'),
                      onClick: () => navigate('/tickets/new'),
                    }
                  : undefined
              }
            />
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {t('table.showing')} {(filters.page! - 1) * filters.pageSize! + 1}-
                {Math.min(filters.page! * filters.pageSize!, data.total)}{' '}
                {t('table.of')} {data.total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))
                  }
                  disabled={filters.page === 1}
                >
                  {t('table.previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))
                  }
                  disabled={filters.page === data.totalPages}
                >
                  {t('table.next')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('actions.delete')}
        description={t('tickets.deleteConfirm')}
        confirmLabel={t('actions.delete')}
        cancelLabel={t('actions.cancel')}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default TicketsPage;
