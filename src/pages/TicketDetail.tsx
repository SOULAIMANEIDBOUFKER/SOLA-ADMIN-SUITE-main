/**
 * Ticket Detail Page
 * View and manage a single ticket
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccess } from '@/lib/rbac';
import { formatDate, formatRelativeTime } from '@/lib/i18n';
import {
  getTicketById,
  getTicketComments,
  updateTicket,
  addTicketComment,
  deleteTicket,
} from '@/services/ticketsService';
import { TicketStatus, TicketPriority } from '@/types';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
  PriorityBadge,
  ConfirmDialog,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { toast } from 'sonner';

const commentSchema = z.object({
  message: z.string().min(1, 'errors.required').max(1000),
});

type CommentFormData = z.infer<typeof commentSchema>;

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch ticket
  const {
    data: ticket,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicketById(id!),
    enabled: !!id,
  });

  // Fetch comments
  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['ticketComments', id],
    queryFn: () => getTicketComments(id!),
    enabled: !!id,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<{ status: TicketStatus; priority: TicketPriority }>) =>
      updateTicket(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      toast.success(t('tickets.updateSuccess'));
    },
    onError: () => {
      toast.error(t('errors.generic'));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      toast.success(t('tickets.deleteSuccess'));
      navigate('/tickets');
    },
    onError: () => {
      toast.error(t('errors.generic'));
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (message: string) => addTicketComment(id!, message, user!.id),
    onSuccess: () => {
      refetchComments();
      form.reset();
    },
    onError: () => {
      toast.error(t('errors.generic'));
    },
  });

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { message: '' },
  });

  const onSubmitComment = (data: CommentFormData) => {
    commentMutation.mutate(data.message);
  };

  const canUpdate = canAccess(user?.role, 'tickets', 'update');
  const canDelete = canAccess(user?.role, 'tickets', 'delete');

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState message={t('errors.generic')} onRetry={() => refetch()} />
    );
  }

  if (!ticket) {
    return (
      <EmptyState
        title={t('tickets.noTickets')}
        action={{
          label: t('tickets.allTickets'),
          onClick: () => navigate('/tickets'),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate('/tickets')} className="-ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('tickets.allTickets')}
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span className="font-mono">{ticket.id}</span>
            <span>•</span>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{ticket.title}</h1>
        </div>
        {canDelete && (
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('actions.delete')}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {t('tickets.description')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {t('tickets.comments')} ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.author.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('tickets.noComments')}
                </p>
              )}

              {/* Add comment form */}
              {canUpdate && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitComment)}
                    className="flex gap-3 pt-4 border-t"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user?.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder={t('tickets.commentPlaceholder')}
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={commentMutation.isPending}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {t('tickets.addComment')}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('tickets.status')}
                </label>
                {canUpdate ? (
                  <Select
                    value={ticket.status}
                    onValueChange={(value: TicketStatus) =>
                      updateMutation.mutate({ status: value })
                    }
                    disabled={updateMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">
                        {t('ticketStatus.open')}
                      </SelectItem>
                      <SelectItem value="in_progress">
                        {t('ticketStatus.in_progress')}
                      </SelectItem>
                      <SelectItem value="closed">
                        {t('ticketStatus.closed')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <StatusBadge status={ticket.status} />
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('tickets.priority')}
                </label>
                {canUpdate ? (
                  <Select
                    value={ticket.priority}
                    onValueChange={(value: TicketPriority) =>
                      updateMutation.mutate({ priority: value })
                    }
                    disabled={updateMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        {t('ticketPriority.low')}
                      </SelectItem>
                      <SelectItem value="medium">
                        {t('ticketPriority.medium')}
                      </SelectItem>
                      <SelectItem value="high">
                        {t('ticketPriority.high')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <PriorityBadge priority={ticket.priority} />
                )}
              </div>

              {/* Assignee */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('tickets.assignee')}
                </label>
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
                    <span className="text-sm">{ticket.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {t('tickets.unassigned')}
                  </span>
                )}
              </div>

              {/* Timestamps */}
              <div className="pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('tickets.createdAt')}
                  </span>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('tickets.updatedAt')}
                  </span>
                  <span>{formatDate(ticket.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t('actions.delete')}
        description={t('tickets.deleteConfirm')}
        confirmLabel={t('actions.delete')}
        cancelLabel={t('actions.cancel')}
        onConfirm={() => deleteMutation.mutate(id!)}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default TicketDetailPage;
