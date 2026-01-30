
export type UserRole = 'admin' | 'staff' | 'viewer';

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// Ticket statuses
export type TicketStatus = 'open' | 'in_progress' | 'closed';

// Ticket priorities
export type TicketPriority = 'low' | 'medium' | 'high';

// Ticket model
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
}

// Comment model for ticket discussions
export interface Comment {
  id: string;
  ticketId: string;
  author: User;
  message: string;
  createdAt: string;
}

// Activity log entry types
export type ActivityType = 
  | 'ticket_created'
  | 'ticket_updated'
  | 'ticket_closed'
  | 'comment_added'
  | 'user_created'
  | 'user_updated';

// Activity log entry
export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  createdAt: string;
  userId?: string;
  ticketId?: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  totalUsers: number;
  activityCount: number;
}

// Chart data for tickets over time
export interface TicketChartData {
  date: string;
  count: number;
}

// Chart data for tickets by status
export interface TicketStatusData {
  status: TicketStatus;
  count: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Filter options for tickets
export interface TicketFilters {
  search?: string;
  status?: TicketStatus | 'all';
  priority?: TicketPriority | 'all';
  page?: number;
  pageSize?: number;
}
