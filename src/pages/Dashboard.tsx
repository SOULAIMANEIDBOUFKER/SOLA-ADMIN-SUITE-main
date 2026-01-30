/**
 * Dashboard Page
 * Main overview with KPIs, charts, and recent activity
 */

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Ticket,
  Users,
  AlertCircle,
  Activity,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber, formatRelativeTime } from '@/lib/i18n';
import {
  getDashboardStats,
  getRecentActivity,
  getTicketsOverTime,
  getTicketsByStatus,
} from '@/services/dashboardService';
import { StatCard, EmptyState, ErrorState } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CHART_COLORS = {
  open: 'hsl(199, 89%, 48%)',
  in_progress: 'hsl(38, 92%, 50%)',
  closed: 'hsl(142, 71%, 45%)',
};

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Fetch dashboard data
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const {
    data: activities,
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities,
  } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: () => getRecentActivity(8),
  });

  const { data: ticketsOverTime, isLoading: chartLoading } = useQuery({
    queryKey: ['ticketsOverTime'],
    queryFn: getTicketsOverTime,
  });

  const { data: ticketsByStatus } = useQuery({
    queryKey: ['ticketsByStatus'],
    queryFn: getTicketsByStatus,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.welcome')}, {user?.name}
        </p>
      </div>

      {/* Stats Error */}
      {statsError && (
        <ErrorState
          message={t('errors.generic')}
          onRetry={() => refetchStats()}
        />
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('dashboard.totalTickets')}
          value={stats ? formatNumber(stats.totalTickets) : '0'}
          icon={Ticket}
          isLoading={statsLoading}
        />
        <StatCard
          label={t('dashboard.openTickets')}
          value={stats ? formatNumber(stats.openTickets) : '0'}
          icon={AlertCircle}
          trend={{ value: 12, isPositive: false }}
          isLoading={statsLoading}
        />
        <StatCard
          label={t('dashboard.totalUsers')}
          value={stats ? formatNumber(stats.totalUsers) : '0'}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          isLoading={statsLoading}
        />
        <StatCard
          label={t('dashboard.recentActivity')}
          value={stats ? formatNumber(stats.activityCount) : '0'}
          icon={TrendingUp}
          isLoading={statsLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Line Chart - Tickets Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {t('dashboard.ticketsOverTime')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.last14Days')}
            </p>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ticketsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })
                    }
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Tickets by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {t('dashboard.ticketsByStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ticketsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {ticketsByStatus?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[entry.status]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value,
                      t(`ticketStatus.${name}`),
                    ]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              {ticketsByStatus?.map((entry) => (
                <div key={entry.status} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[entry.status] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {t(`ticketStatus.${entry.status}`)} ({entry.count})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Activity className="h-4 w-4" />
            {t('dashboard.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesError ? (
            <ErrorState
              message={t('errors.generic')}
              onRetry={() => refetchActivities()}
            />
          ) : activitiesLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="rounded-full bg-primary/10 p-2">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('dashboard.noActivity')}
              icon={Activity}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
