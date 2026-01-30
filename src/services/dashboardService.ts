/**
 * Dashboard API Service
 * Handles dashboard statistics and charts data
 */

import config from '@/config/env';
import api from '@/lib/api';
import { DashboardStats, Activity, TicketChartData, TicketStatusData } from '@/types';
import {
  mockDashboardStats,
  mockActivities,
  generateTicketChartData,
  mockTicketStatusData,
} from '@/services/mockData';

// Simulate API delay for mock mode
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (config.enableMock) {
    await delay(500);
    return mockDashboardStats;
  }

  const response = await api.get<DashboardStats>('/dashboard/stats');
  return response.data;
};

/**
 * Get recent activity
 */
export const getRecentActivity = async (limit = 8): Promise<Activity[]> => {
  if (config.enableMock) {
    await delay(400);
    return mockActivities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  const response = await api.get<Activity[]>('/dashboard/activity', {
    params: { limit },
  });
  return response.data;
};

/**
 * Get tickets over time chart data
 */
export const getTicketsOverTime = async (): Promise<TicketChartData[]> => {
  if (config.enableMock) {
    await delay(600);
    return generateTicketChartData();
  }

  const response = await api.get<TicketChartData[]>('/dashboard/tickets-over-time');
  return response.data;
};

/**
 * Get tickets by status chart data
 */
export const getTicketsByStatus = async (): Promise<TicketStatusData[]> => {
  if (config.enableMock) {
    await delay(400);
    return mockTicketStatusData;
  }

  const response = await api.get<TicketStatusData[]>('/dashboard/tickets-by-status');
  return response.data;
};
