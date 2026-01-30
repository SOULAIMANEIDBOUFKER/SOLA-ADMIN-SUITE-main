/**
 * New Ticket Page
 * Form to create a new ticket with validation
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { createTicket } from '@/services/ticketsService';
import { TicketStatus, TicketPriority } from '@/types';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Form validation schema
const ticketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100, { message: 'Title must be at most 100 characters' }),
  description: z
    .string()
    .trim()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(1000, { message: 'Description must be at most 1000 characters' }),
  status: z.enum(['open', 'in_progress', 'closed']),
  priority: z.enum(['low', 'medium', 'high']),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const NewTicketPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
    },
  });

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success(t('tickets.createSuccess'));
      navigate(`/tickets/${newTicket.id}`);
    },
    onError: () => {
      toast.error(t('errors.generic'));
    },
  });

  const onSubmit = (data: TicketFormData) => {
    createMutation.mutate({
      title: data.title,
      description: data.description,
      status: data.status as TicketStatus,
      priority: data.priority as TicketPriority,
    });
  };

  return (
    <RoleGuard resource="tickets" action="create">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/tickets')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t('tickets.newTicket')}
            </h1>
            <p className="text-muted-foreground">
              {t('tickets.createDescription', 'Create a new support ticket')}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{t('tickets.ticketDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('tickets.ticketTitle')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('tickets.titlePlaceholder', 'Enter ticket title...')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('tickets.description')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('tickets.descriptionPlaceholder', 'Describe the issue in detail...')}
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('tickets.status')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('tickets.status')} />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Priority */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('tickets.priority')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('tickets.priority')} />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/tickets')}
                  >
                    {t('actions.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending
                      ? t('app.loading')
                      : t('actions.create')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
};

export default NewTicketPage;
