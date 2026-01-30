/**
 * Users Page
 * Manage users (admin only for most actions)
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users as UsersIcon, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccess } from '@/lib/rbac';
import { formatDate } from '@/lib/i18n';
import { getUsers, deleteUser, updateUser } from '@/services/usersService';
import { User, UserRole } from '@/types';
import { RoleGuard } from '@/components/auth';
import { EmptyState, ErrorState, ConfirmDialog } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const roleStyles: Record<UserRole, string> = {
  admin: 'bg-primary/10 text-primary border-primary/20',
  staff: 'bg-info/10 text-info border-info/20',
  viewer: 'bg-muted text-muted-foreground border-border',
};

const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch users
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('users.deleteSuccess'));
      setDeleteId(null);
    },
    onError: () => {
      toast.error(t('errors.generic'));
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      updateUser(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t('users.updateSuccess'));
      setEditingId(null);
    },
    onError: () => {
      toast.error(t('errors.generic'));
    },
  });

  const canCreate = canAccess(currentUser?.role, 'users', 'create');
  const canUpdate = canAccess(currentUser?.role, 'users', 'update');
  const canDelete = canAccess(currentUser?.role, 'users', 'delete');

  return (
    <RoleGuard resource="users" action="view">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t('users.title')}
            </h1>
            <p className="text-muted-foreground">{t('users.allUsers')}</p>
          </div>
          {canCreate && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('users.newUser')}
            </Button>
          )}
        </div>

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
                      <TableHead>{t('users.name')}</TableHead>
                      <TableHead>{t('users.email')}</TableHead>
                      <TableHead className="w-40">{t('users.role')}</TableHead>
                      <TableHead className="w-40">{t('users.createdAt')}</TableHead>
                      {(canUpdate || canDelete) && (
                        <TableHead className="w-24" />
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          {canUpdate && editingId === user.id ? (
                            <Select
                              value={user.role}
                              onValueChange={(value: UserRole) => {
                                updateRoleMutation.mutate({
                                  id: user.id,
                                  role: value,
                                });
                              }}
                              disabled={updateRoleMutation.isPending}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  {t('roles.admin')}
                                </SelectItem>
                                <SelectItem value="staff">
                                  {t('roles.staff')}
                                </SelectItem>
                                <SelectItem value="viewer">
                                  {t('roles.viewer')}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge
                              variant="outline"
                              className={roleStyles[user.role]}
                            >
                              {t(`roles.${user.role}`)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        {(canUpdate || canDelete) && (
                          <TableCell>
                            <div className="flex gap-1">
                              {canUpdate && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setEditingId(
                                      editingId === user.id ? null : user.id
                                    )
                                  }
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {canDelete && user.id !== currentUser?.id && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteId(user.id)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState
                icon={UsersIcon}
                title={t('users.noUsers')}
                action={
                  canCreate
                    ? {
                        label: t('users.newUser'),
                        onClick: () => {},
                      }
                    : undefined
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title={t('actions.delete')}
          description={t('users.deleteConfirm')}
          confirmLabel={t('actions.delete')}
          cancelLabel={t('actions.cancel')}
          onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
          variant="destructive"
          isLoading={deleteMutation.isPending}
        />
      </div>
    </RoleGuard>
  );
};

export default UsersPage;
