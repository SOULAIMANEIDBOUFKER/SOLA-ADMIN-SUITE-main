/**
 * Mock Data Service
 * Provides realistic mock data for development and demo purposes
 */

import { User, Ticket, Comment, Activity, DashboardStats, TicketChartData, TicketStatusData } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@sola.dev',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'sarah@sola.dev',
    role: 'staff',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Max Weber',
    email: 'max@sola.dev',
    role: 'staff',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Anna Schmidt',
    email: 'anna@sola.dev',
    role: 'viewer',
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: '5',
    name: 'Thomas Klein',
    email: 'thomas@sola.dev',
    role: 'viewer',
    createdAt: '2024-03-01T00:00:00Z',
  },
];

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Login page not loading on Safari',
    description: 'Users report that the login page shows a blank screen on Safari 16. This appears to be related to the new CSS features we added.',
    status: 'open',
    priority: 'high',
    assignee: mockUsers[1],
    createdAt: '2024-03-20T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
  },
  {
    id: 'TKT-002',
    title: 'Dashboard performance optimization',
    description: 'The dashboard is loading slowly with large datasets. Need to implement pagination and lazy loading for charts.',
    status: 'in_progress',
    priority: 'medium',
    assignee: mockUsers[2],
    createdAt: '2024-03-19T08:00:00Z',
    updatedAt: '2024-03-20T09:00:00Z',
  },
  {
    id: 'TKT-003',
    title: 'Add export to CSV feature',
    description: 'Users want to export their ticket data to CSV format for reporting purposes.',
    status: 'open',
    priority: 'low',
    assignee: undefined,
    createdAt: '2024-03-18T15:20:00Z',
    updatedAt: '2024-03-18T15:20:00Z',
  },
  {
    id: 'TKT-004',
    title: 'Fix email notification templates',
    description: 'Email notifications are showing HTML tags instead of formatted content.',
    status: 'closed',
    priority: 'high',
    assignee: mockUsers[1],
    createdAt: '2024-03-17T09:00:00Z',
    updatedAt: '2024-03-19T16:30:00Z',
  },
  {
    id: 'TKT-005',
    title: 'Implement dark mode for mobile',
    description: 'Dark mode works on desktop but not on mobile devices. Need to add responsive dark mode support.',
    status: 'in_progress',
    priority: 'medium',
    assignee: mockUsers[2],
    createdAt: '2024-03-16T11:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 'TKT-006',
    title: 'Update user documentation',
    description: 'Documentation is outdated after the latest feature release. Need to update screenshots and instructions.',
    status: 'open',
    priority: 'low',
    assignee: undefined,
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
  },
  {
    id: 'TKT-007',
    title: 'API rate limiting issues',
    description: 'Some users are hitting rate limits too quickly. Need to review and adjust the limits.',
    status: 'closed',
    priority: 'high',
    assignee: mockUsers[1],
    createdAt: '2024-03-14T08:30:00Z',
    updatedAt: '2024-03-16T11:45:00Z',
  },
  {
    id: 'TKT-008',
    title: 'Add keyboard shortcuts',
    description: 'Implement keyboard shortcuts for common actions like creating tickets and navigating between pages.',
    status: 'open',
    priority: 'medium',
    assignee: mockUsers[2],
    createdAt: '2024-03-13T10:00:00Z',
    updatedAt: '2024-03-13T10:00:00Z',
  },
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'CMT-001',
    ticketId: 'TKT-001',
    author: mockUsers[1],
    message: 'I was able to reproduce this issue on Safari 16.3. It seems related to the grid layout we use on the login form.',
    createdAt: '2024-03-20T11:00:00Z',
  },
  {
    id: 'CMT-002',
    ticketId: 'TKT-001',
    author: mockUsers[0],
    message: 'Can you try using flexbox instead of grid for the login form layout? That should be more compatible.',
    createdAt: '2024-03-20T11:30:00Z',
  },
  {
    id: 'CMT-003',
    ticketId: 'TKT-002',
    author: mockUsers[2],
    message: 'I\'ve started implementing virtual scrolling for the data tables. Initial tests show 60% improvement in render time.',
    createdAt: '2024-03-20T09:15:00Z',
  },
  {
    id: 'CMT-004',
    ticketId: 'TKT-004',
    author: mockUsers[1],
    message: 'Fixed the email template rendering. The issue was with the HTML sanitization library stripping too many tags.',
    createdAt: '2024-03-19T16:00:00Z',
  },
  {
    id: 'CMT-005',
    ticketId: 'TKT-004',
    author: mockUsers[0],
    message: 'Confirmed working. Closing this ticket.',
    createdAt: '2024-03-19T16:30:00Z',
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: 'ACT-001',
    type: 'ticket_created',
    message: 'New ticket TKT-001 was created',
    createdAt: '2024-03-20T10:30:00Z',
    ticketId: 'TKT-001',
  },
  {
    id: 'ACT-002',
    type: 'comment_added',
    message: 'Sarah Miller commented on TKT-001',
    createdAt: '2024-03-20T11:00:00Z',
    ticketId: 'TKT-001',
    userId: '2',
  },
  {
    id: 'ACT-003',
    type: 'ticket_updated',
    message: 'TKT-002 status changed to In Progress',
    createdAt: '2024-03-20T09:00:00Z',
    ticketId: 'TKT-002',
  },
  {
    id: 'ACT-004',
    type: 'user_created',
    message: 'New user Thomas Klein was created',
    createdAt: '2024-03-19T14:00:00Z',
    userId: '5',
  },
  {
    id: 'ACT-005',
    type: 'ticket_closed',
    message: 'TKT-004 was closed',
    createdAt: '2024-03-19T16:30:00Z',
    ticketId: 'TKT-004',
  },
  {
    id: 'ACT-006',
    type: 'ticket_closed',
    message: 'TKT-007 was closed',
    createdAt: '2024-03-16T11:45:00Z',
    ticketId: 'TKT-007',
  },
  {
    id: 'ACT-007',
    type: 'comment_added',
    message: 'Max Weber commented on TKT-002',
    createdAt: '2024-03-20T09:15:00Z',
    ticketId: 'TKT-002',
    userId: '3',
  },
  {
    id: 'ACT-008',
    type: 'ticket_created',
    message: 'New ticket TKT-003 was created',
    createdAt: '2024-03-18T15:20:00Z',
    ticketId: 'TKT-003',
  },
];

// Dashboard Statistics
export const mockDashboardStats: DashboardStats = {
  totalTickets: mockTickets.length,
  openTickets: mockTickets.filter((t) => t.status === 'open').length,
  totalUsers: mockUsers.length,
  activityCount: mockActivities.length,
};

// Generate chart data for tickets over time (last 14 days)
export const generateTicketChartData = (): TicketChartData[] => {
  const data: TicketChartData[] = [];
  const now = new Date();

  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 8) + 2,
    });
  }

  return data;
};

// Ticket status distribution
export const mockTicketStatusData: TicketStatusData[] = [
  { status: 'open', count: mockTickets.filter((t) => t.status === 'open').length },
  { status: 'in_progress', count: mockTickets.filter((t) => t.status === 'in_progress').length },
  { status: 'closed', count: mockTickets.filter((t) => t.status === 'closed').length },
];
