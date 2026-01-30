/**
 * Tickets API Service
 * Handles all ticket-related API calls with mock fallback
 */

import config from '@/config/env';
import api from '@/lib/api';
import { Ticket, Comment, TicketFilters, PaginatedResponse } from '@/types';
import { mockTickets, mockComments } from '@/services/mockData';

// Simulate API delay for mock mode
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get paginated list of tickets with filters
 */
export const getTickets = async (
  filters: TicketFilters = {}
): Promise<PaginatedResponse<Ticket>> => {
  if (config.enableMock) {
    await delay(500);

    let filtered = [...mockTickets];

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.id.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filtered.slice(start, end);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  }

  const response = await api.get<PaginatedResponse<Ticket>>('/tickets', {
    params: filters,
  });
  return response.data;
};

/**
 * Get single ticket by ID
 */
export const getTicketById = async (id: string): Promise<Ticket | null> => {
  if (config.enableMock) {
    await delay(300);
    return mockTickets.find((t) => t.id === id) || null;
  }

  const response = await api.get<Ticket>(`/tickets/${id}`);
  return response.data;
};

/**
 * Create a new ticket
 */
export const createTicket = async (
  ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Ticket> => {
  if (config.enableMock) {
    await delay(500);
    const newTicket: Ticket = {
      ...ticket,
      id: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTickets.unshift(newTicket);
    return newTicket;
  }

  const response = await api.post<Ticket>('/tickets', ticket);
  return response.data;
};

/**
 * Update an existing ticket
 */
export const updateTicket = async (
  id: string,
  updates: Partial<Ticket>
): Promise<Ticket> => {
  if (config.enableMock) {
    await delay(500);
    const index = mockTickets.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Ticket not found');

    mockTickets[index] = {
      ...mockTickets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockTickets[index];
  }

  const response = await api.patch<Ticket>(`/tickets/${id}`, updates);
  return response.data;
};

/**
 * Delete a ticket
 */
export const deleteTicket = async (id: string): Promise<void> => {
  if (config.enableMock) {
    await delay(500);
    const index = mockTickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      mockTickets.splice(index, 1);
    }
    return;
  }

  await api.delete(`/tickets/${id}`);
};

/**
 * Get comments for a ticket
 */
export const getTicketComments = async (ticketId: string): Promise<Comment[]> => {
  if (config.enableMock) {
    await delay(300);
    return mockComments.filter((c) => c.ticketId === ticketId);
  }

  const response = await api.get<Comment[]>(`/tickets/${ticketId}/comments`);
  return response.data;
};

/**
 * Add a comment to a ticket
 */
export const addTicketComment = async (
  ticketId: string,
  message: string,
  authorId: string
): Promise<Comment> => {
  if (config.enableMock) {
    await delay(500);
    const author = await import('@/services/mockData').then(
      (m) => m.mockUsers.find((u) => u.id === authorId)!
    );
    const newComment: Comment = {
      id: `CMT-${String(mockComments.length + 1).padStart(3, '0')}`,
      ticketId,
      author,
      message,
      createdAt: new Date().toISOString(),
    };
    mockComments.push(newComment);
    return newComment;
  }

  const response = await api.post<Comment>(`/tickets/${ticketId}/comments`, {
    message,
  });
  return response.data;
};
